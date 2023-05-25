<?php

namespace App\Http\Controllers\Writer\Orders;

use App\Events\NewOrderSubmissionEvent;
use App\Events\OrderAcceptedEvent;
use App\Events\OrderCompletedEvent;
use App\Events\OrderDeclinedEvent;
use App\Http\Controllers\Controller;
use App\Models\Allocation;
use App\Models\AssignedOrder;
use App\Models\Order;
use App\Models\OrderPayment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SingleOrderController extends Controller
{
    function index($order){
        return $this->json($order->writerFresh());
    }

    function acceptOrderAllocation($order){
        $writer = $this->writer();
        
        $allocation = $order->allocations()
            ->latest()
            ->where('writer_id', $writer->id)
            ->first();

        try{
            DB::beginTransaction();

            // Update the original allocation status
            $allocation->status = Allocation::STATUS_ACCEPTED;
            $allocation->save();

            // Update the order status
            $order->status = Order::STATUS_ACTIVE;
            $order->save();

            // Assign to writer
            $assignedOrder = AssignedOrder::create([
                'order_id' => $order->id,
                'writer_id' => $writer->id,
                'deadline' => $allocation->deadline,
                'status' => AssignedOrder::STATUS_IN_PROGRESS
            ]);

            // Create an order payment record
            OrderPayment::create([
                'assigned_order_id' => $assignedOrder->id,
                'amount' => $allocation->price,
                'type' => OrderPayment::TYPE_PAYMENT,
                'status' => OrderPayment::STATUS_PENDING,
            ]);

            // Done
            OrderAcceptedEvent::dispatch($allocation);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->writerFresh(),
                'status' => 'Order has been accepted successfully'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry'.$e->getMessage()
        ]);
    }

    function declineOrderAllocation($order){
        $writer = $this->writer();

        $allocation = $order->allocations()
            ->latest()
            ->where('writer_id', $writer->id)
            ->first();

        try{
            DB::beginTransaction();

            // Update the original allocation status
            $allocation->status = Allocation::STATUS_DECLINED;
            $allocation->save();

            // Update the order status
            $order->status = Order::STATUS_NEW;
            $order->save();

            // Done
            OrderDeclinedEvent::dispatch($allocation);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->writerFresh(),
                'status' => 'Order has been declined'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry'
        ]);
    }

    function addSubmission(Request $request, $order){
        $validator = validator($request->all(), [
            'text' => 'nullable',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file',
            'plag_report.*' => 'file|mimes:pdf,doc,docx',
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        // Check if subission can be done
        if(!($order->isCompleted() || $order->isActive())){
            return $this->json([
                'success' => false,
                'status' => 'Submission cannot be done when the order is in '.strtolower($order->status).' status'
            ]);
        }

        try{
            $writer = $this->writer();

            // Get latest assignment
            $assignment = $order->assignments()
                ->latest()
                ->where('writer_id', $writer->id)
                ->first();

            DB::beginTransaction();

            // Save submission
            $submission = $assignment->submissions()->create([
                'answer' => $request->post('answer'),
                'is_final' => $request->boolean('is_final'),
            ]);

            // Save attachments
            if($request->hasFile('plag_report')){
                $plagReport = $request->file('plag_report');
                
                $submission->attachments()->create([
                    'name' => $plagReport->getClientOriginalName(),
                    'path' => $plagReport->store('attachments', 'public'),
                    'type' => $plagReport->getMimeType(),
                ]);
            }

            if($request->hasFile('attachments')){
                foreach($request->file('attachments') as $file){
                    $submission->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $file->store('attachments', 'public'),
                        'type' => $file->getMimeType(),
                    ]);
                }
            }

            NewOrderSubmissionEvent::dispatch($submission);

            // Update the order status if necessary
            if(!$order->isCompleted() && $request->boolean('is_final')){
                $order->status = Order::STATUS_COMPLETED;
                $order->save();
                OrderCompletedEvent::dispatch($order);
            }

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->writerFresh(),
                'status' => 'Order submission has been sent successfully'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry'
        ]);
    }

}
