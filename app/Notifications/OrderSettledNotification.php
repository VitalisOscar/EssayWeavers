<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderSettledNotification extends Notification
{
    use Queueable;

    public $order, $totalCleared;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($order, $totalCleared)
    {
        $this->order = $order;
        $this->totalCleared = $totalCleared;
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
            ->subject('Order Settled: '.$this->order->title)
            ->view('mail.order_settled', [
                'name' => $this->order->current_writer->name,
                'order' => $this->order,
                'cleared_amount' => $this->totalCleared,
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
