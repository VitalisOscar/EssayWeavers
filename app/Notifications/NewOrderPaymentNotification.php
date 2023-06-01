<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderPaymentNotification extends Notification
{
    use Queueable;

    public $order, $amount, $type, $total_writer_price;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($order, $amount, $type, $total_writer_price)
    {
        $this->order = $order;
        $this->amount = $amount;
        $this->type = $type;
        $this->total_writer_price = $total_writer_price;
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
            ->subject('Bonus Payment: '.$this->order->title)
            ->view('mail.new_order_payment', [
                'name' => $this->order->current_writer->name,
                'order' => $this->order,
                'type' => $this->type,
                'amount' => $this->amount,
                'total_writer_price' => $this->total_writer_price,
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
