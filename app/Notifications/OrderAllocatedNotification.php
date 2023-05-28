<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderAllocatedNotification extends Notification
{
    use Queueable;

    public $allocation;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($allocation)
    {
        $this->allocation = $allocation;
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
            ->subject('New order received')
            ->view('mail.new_order', [
                'name' => $this->allocation->writer->name,
                'order' => $this->allocation->order,
                'price' => $this->allocation->price_formatted,
                'deadline' => $this->allocation->deadline_formatted,
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
