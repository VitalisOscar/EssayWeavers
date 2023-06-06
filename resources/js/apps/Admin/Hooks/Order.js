import { differenceInMinutes, isAfter } from "date-fns"

const useOrderMetricsTimeToDeadline = (deadline, compareTime) => {
    let writerDeadline = new Date()
    if(compareTime != ''){
        writerDeadline = new Date(compareTime)
    }

    let orderDeadline = new Date(deadline)

    let diff = Math.abs(differenceInMinutes(orderDeadline, writerDeadline))

    let days = Math.abs(Math.floor(diff/(1440)))
    let hours = Math.abs((Math.floor(diff/60)) % 24)
    let minutes = Math.abs((diff - (days * 1440) - (hours * 60)) )

    let final = ''
    if(days > 0){
        final += days + (days > 1 ? ' days' : ' day')
    }

    if(hours > 0){
        final += ' ' + hours + (hours > 1 ? ' hours' : ' hour')
    }

    if(minutes > 0){
        final += ' ' + minutes + (minutes > 1 ? ' minutes' : ' minute')
    }

    return {
        difference: final,
        positive: isAfter(orderDeadline, writerDeadline)
    }
}

const useOrderMetricsProfit = (received_amount, payout_amount) => {
    let profit = received_amount

    if(payout_amount !== ''){
        profit = profit - payout_amount
    }

    return profit
}

export { useOrderMetricsTimeToDeadline, useOrderMetricsProfit }
