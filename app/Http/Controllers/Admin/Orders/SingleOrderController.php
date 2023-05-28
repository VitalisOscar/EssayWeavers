<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Events\NewOrderIssueEvent;
use App\Events\NewOrderPaymentEvent;
use App\Events\OrderAllocatedEvent;
use App\Events\OrderAllocationDeletedEvent;
use App\Events\OrderAllocationUpdatedEvent;
use App\Events\OrderCancelledEvent;
use App\Events\OrderPriceUpdatedEvent;
use App\Events\OrderSettledEvent;
use App\Events\OrderUpdatedEvent;
use App\Events\WriterDeadlineUpdatedEvent;
use App\Http\Controllers\Controller;
use App\Models\Allocation;
use App\Models\AssignedOrder;
use App\Models\BidderPayment;
use App\Models\Issue;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\Writer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SingleOrderController extends Controller
{
    function index(Request $request, $order){
        return $this->json($order->adminFresh());
    }

    function allocateWriter(Request $request, $order){
        $validator = validator($request->all(), [
            'writer_price' => 'required|numeric|min:1',
            'writer_deadline' => 'required|date|date_format:Y-m-d H:i',
            'writer' => 'nullable|exists:writers,id'
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        // Check if alocatable
        if(!($order->isNew() || $order->isAllocated())){
            return $this->json([
                'success' => false,
                'status' => "The order cannot be allocated since it is currently in '".$order->status."' status",
            ]);
        }

        try{
            DB::beginTransaction();

            $writer = Writer::where('id', $request->post('writer'))->first();

            // Check if being newly allocated or updated
            if($order->isNew()){

                // Update status order
                $order->status = Order::STATUS_ALLOCATED;
                $order->save();

                $allocation = Allocation::create([
                    'writer_id' => $writer->id,
                    'order_id' => $order->id,
                    'deadline' => $request->post('writer_deadline'),
                    'price' => $request->post('writer_price'),
                    'status' => Allocation::STATUS_PENDING
                ]);

                OrderAllocatedEvent::dispatch($allocation);
                $successMessage = 'Order has been allocated successfully to the writer';
            }else{
                $allocation = $order->current_allocation;

                $allocation->update([
                    'writer_id' => $writer->id,
                    'deadline' => $request->post('writer_deadline'),
                    'price' => $request->post('writer_price')
                ]);

                OrderAllocationUpdatedEvent::dispatch($allocation);
                $successMessage = 'Order allocation has been successfully updated';
            }

            DB::commit();

            return $this->json([
                'success' => true,
                'status' => $successMessage,
                'data' => $order->adminFresh(),
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function deleteAllocation(Request $request, $order){
        // Check if deletable
        if(!($order->isAllocated())){
            return $this->json([
                'success' => false,
                'status' => "The allocation cannot be deleted since the order is currently in '".$order->status."' status",
            ]);
        }

        try{
            DB::beginTransaction();

            $writer = Writer::where('id', $request->post('writer'))->first();

            // Delete current allocation
            $allocation = $order->current_allocation;
            $allocation->delete();

            // Update order status
            $order->status = Order::STATUS_NEW;
            $order->save();

            // Done
            OrderAllocationDeletedEvent::dispatch($allocation);

            DB::commit();

            return $this->json([
                'success' => true,
                'status' => 'Order allocation has been successfully deleted',
                'data' => $order->adminFresh()
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function addIssue(Request $request, $order){
        $validator = validator($request->all(), [
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        try{
            DB::beginTransaction();

                $issue = Issue::create([
                    'assigned_order_id' => $order->assignments()->latest()->first()->id,
                    'title' => $request->post('title'),
                    'description' => $request->post('description'),
                    'status' => Issue::STATUS_NEW
                ]);

                NewOrderIssueEvent::dispatch($issue);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->adminFresh(),
                'status' => 'Issue has been added successfully and writer notified'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function addPayment(Request $request, $order){
        $validator = validator($request->all(), [
            'amount' => 'required|numeric|min:1',
            'type' => 'required|in:'.implode(',', OrderPayment::TYPES),
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        try{
            DB::beginTransaction();

            // Get the latest assignment
            $assignment = $order->assignments()
                ->latest()
                ->first();

            // Add the payment
            $assignment->payments()->create([
                'amount' => $request->post('amount'),
                'type' => $request->post('type'),
                'status' => $order->isSettled() ?
                    OrderPayment::STATUS_CLEARED : OrderPayment::STATUS_PENDING
            ]);

            NewOrderPaymentEvent::dispatch($order);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->adminFresh(),
                'status' => 'The additional payment has been added successfully'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function settleOrder(Request $request, $order){
        try{
            DB::beginTransaction();

            // Get latest assigned writer
            $assignment = $order->assignments()
                ->latest()
                ->first();

            // Mark assignment as done
            $assignment->status = AssignedOrder::STATUS_COMPLETED;
            $assignment->save();

            // Mark order as settled
            $order->status = Order::STATUS_SETTLED;
            $order->save();

            // Mark all pending earnings as cleared
            $assignment->payments()
                ->pending()
                ->update([
                    'status' => OrderPayment::STATUS_CLEARED
                ]);

            // If the order had a bidder, mark the commission allocation for this order as cleared
            $order->bidder_payment()->update([
                'status' => BidderPayment::STATUS_CLEARED
            ]);

            // All Done
            OrderSettledEvent::dispatch($order);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->adminFresh(),
                'status' => 'Order has been settled successfully and all associated payments updated'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function cancelOrder(Request $request, $order){
        $validator = validator($request->all(), [
            'reason' => 'required',
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        try{
            DB::beginTransaction();

            // Check order status
            if($order->isCancelled()){
                return $this->json([
                    'success' => false,
                    'status' => "The order is already cancelled",
                ]);
            }

            if($order->isSettled()){
                return $this->json([
                    'success' => false,
                    'status' => "The order is already settled",
                ]);
            }

            // For allocated orders which have not been accepted yet, delete the allocation
            if($order->isAllocated()){
                $order->allocations()->delete();
            }

            // For orders in progress or complete, mark the assignments as cancelled
            // and their payments as cancelled
            if($order->isActive() || $order->isCompleted()){
                $order->assignments()
                    ->update([
                        'assigned_orders.status' => AssignedOrder::STATUS_CANCELLED
                    ]);

                $order->payments()
                    ->update([
                        'order_payments.status' => OrderPayment::STATUS_CANCELLED
                    ]);
            }

            // Create a cancellation record
            $order->cancellations()->create([
                'reason' => $request->post('reason')
            ]);

            // If the order had a bidder, mark the commission allocation for this order as cancelled
            $order->bidder_payment()->update([
                'status' => BidderPayment::STATUS_CANCELLED
            ]);

            // Mark order as cancelled
            $order->status = Order::STATUS_CANCELLED;
            $order->save();

            // All Done
            OrderCancelledEvent::dispatch($order);

            DB::commit();

            return $this->json([
                'success' => true,
                'status' => 'The order has been cancelled successfully',
                'data' => $order->adminFresh(),
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function editOrderPrice(Request $request, $order){
        $validator = validator($request->all(), [
            'amount' => 'required|numeric|min:1'
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        try{
            DB::beginTransaction();

            // Update
            $order->price = $request->post('amount');
            $order->save();

            OrderPriceUpdatedEvent::dispatch($order);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->adminFresh(),
                'status' => 'Order price has been updated successfully'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function editWriterDeadline(Request $request, $order){
        $validator = validator($request->all(), [
            'deadline' => 'required'
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        try{
            DB::beginTransaction();

            // Latest assignment
            $assignment = $order->assignments()->latest()->first();

            // Update
            $assignment->deadline = $request->post('deadline');
            $assignment->save();

            WriterDeadlineUpdatedEvent::dispatch($order);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->adminFresh(),
                'status' => 'Writer deadline has been updated successfully'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }

    function editRequirements(Request $request, $order){
        $validator = validator($request->all(), [
            'requirements' => 'nullable',
            'attachments' => 'nullable',
            'attachments.*' => 'file',
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        try{
            DB::beginTransaction();

            // Update requirements
            $order->requirements = $request->post('requirements');
            $order->save();

            // Save new attachments
            if($request->hasFile('attachments')){
                foreach($request->file('attachments') as $file){
                    $order->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $file->store('attachments', 'public'),
                        'type' => $file->getMimeType(),
                    ]);
                }
            }

            // Delete attachments to be deleted
            $order->attachments()->whereIn('id', $request->post('delete_attachments', []))
                ->delete();

            OrderUpdatedEvent::dispatch($order);

            DB::commit();

            return $this->json([
                'success' => true,
                'data' => $order->adminFresh(),
                'status' => 'Order has been updated successfully'
            ]);
        }catch(Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => "Something went wrong. Please try again",
        ]);
    }
}
