<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Events\NewOrderEvent;
use App\Events\OrderAllocatedEvent;
use App\Http\Controllers\Admin\Writers\WritersDataController;
use App\Http\Controllers\Controller;
use App\Models\Allocation;
use App\Models\BidderPayment;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Source;
use App\Models\Writer;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{
    function index(Request $request){
        $query = Order::latest()->with([
            'source', 'bidder', 'bidder_payment', 'logs', 'attachments', 'allocations.writer',
            'assignments.writer', 'assignments.payments',
            'allocations' => function($q){
                $q->latest();
            },
            'assignments' => function($q){
                $q->latest();
            },
            'submissions' => function($q){
                $q->latest();
            },
        ]);

        // Filters
        if($request->filled('status')){
            $status = $request->get('status');

            if($status == 'new'){
                $query->new();
            }else if($status == 'allocated'){
                $query->allocated();
            }else if($status == 'active'){
                $query->active();
            }else if($status == 'completed'){
                $query->completed();
            }else if($status == 'cancelled'){
                $query->cancelled();
            }else if($status == 'need-revision'){
                $query->needReview();
            }else if($status == 'settled'){
                $query->settled();
            }
        }

        if($request->filled('search')){
            $query->where(function($q) use($request){
                $q->where('id', $request->get('search'))
                    ->orWhere('title', 'like', '%'.$request->get('search').'%');
            });
        }

        return $this->json([
            'data' => $query->paginate($request->get('limit', 15))
                ->map(function($order){
                    return $order->adminArray();
                })
        ]);
    }

    function add(Request $request){
        $allocating = $request->filled('writer');

        $request->request->add(['raw' => 1]);

        $sources = app(OrdersDataController::class)->sources($request)->pluck('id')->toArray();
        $bidders = app(OrdersDataController::class)->bidders($request)->pluck('id')->toArray();
        $writers = !$allocating ? [] :
            app(WritersDataController::class)->listWriters($request)->pluck('id')->toArray();

        $rules = [
            'title' => 'required',
            'requirements' => 'nullable',
            'pages' => 'nullable',
            'source' => 'required|in:'.implode(',', $sources),
            'bidder' => 'nullable|in:'.implode(',', $bidders),
            'price' => 'required|numeric|min:1',
            'deadline' => 'required|date|date_format:Y-m-d H:i',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file',
            'writer' => 'in:'.implode(',', $writers),
            'writer_deadline' => 'required|date|date_format:Y-m-d H:i',
            'writer_price' => 'required|numeric|min:1',
            'bidder_commission' => 'nullable|numeric|min:1',
        ];

        if(!$allocating){
            unset($rules['writer'], $rules['writer_price'], $rules['writer_deadline']);
        }

        $validator = validator($request->all(), $rules, [
            'writer_deadline.date' => $request->post('writer_deadline').' '.Carbon::parse($request->post('writer_deadline'))->toDateTimeString()
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'errors' => $validator->errors(),
                'status' => 'Please fix the highlighted errors'
            ]);
        }

        if(!$request->filled('requirements') && !$request->filled('attachments')){
            return $this->json([
                'success' => false,
                'errors' => [
                    'requirements' => 'You need to add order requirements or attach some files'
                ],
                'status' => 'Please fix the highlighted errors'
            ]);
        }

        try{
            DB::beginTransaction();

            // Create the order
            $order = Order::create([
                'title' => $request->post('title'),
                'source_id' => $request->post('source'),
                'bidder_id' => $request->post('bidder'),
                'requirements' => $request->post('requirements', 'Attached'),
                'pages' => $request->post('pages'),
                'price' => $request->post('price'),
                'deadline' => $request->post('deadline'),
                'status' => $allocating ? Order::STATUS_ALLOCATED : Order::STATUS_NEW
            ]);

            // Check if the bidder commission has been set
            if($request->filled(['bidder', 'bidder_commission'])){
                $order->bidder_payment()->create([
                    'bidder_id' => $request->post('bidder'),
                    'amount' => $request->post('bidder_commission'),
                    'status' => BidderPayment::STATUS_PENDING
                ]);
            }

            // Save attachments
            if($request->hasFile('attachments')){
                foreach($request->file('attachments') as $file){
                    $order->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $file->store('attachments', 'public'),
                        'type' => $file->getMimeType(),
                    ]);
                }
            }

            // Allocate to writer
            if($allocating){
                $writer = Writer::where('id', $request->post('writer'))->first();

                $allocation = Allocation::create([
                    'writer_id' => $writer->id,
                    'order_id' => $order->id,
                    'deadline' => $request->post('writer_deadline'),
                    'price' => $request->post('writer_price'),
                    'status' => Allocation::STATUS_PENDING
                ]);

                OrderAllocatedEvent::dispatch($allocation);
            }

            NewOrderEvent::dispatch($order);

            DB::commit();

            return $this->json([
                'success' => true,
                'status' => 'New order created successfully'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry'.$e->getMessage()
        ]);
    }
}
