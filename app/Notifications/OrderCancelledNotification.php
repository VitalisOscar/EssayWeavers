<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCancelledNotification extends Notification
{
    use Queueable;

    public $order, $reason, $previous_status;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($order, $reason, $previous_status)
    {
        $this->order = $order;
        $this->previous_status = $previous_status;
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Order Cancelled: '.$this->order->title)
            ->view('mail.order_cancelled', [
                'name' => $this->order->current_writer->name,
                'order' => $this->order,
                'previous_status' => $this->previous_status,
                'reason' => $this->reason,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
