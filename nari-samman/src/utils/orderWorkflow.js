export const ORDER_FLOW_STEPS = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    shortLabel: 'Confirmed',
    emoji: '✅',
    desc: 'Customer placed the order and vendor received it.'
  },
  {
    key: 'packed',
    label: 'Packed by SHG',
    shortLabel: 'Packed',
    emoji: '📦',
    desc: 'Vendor packed and quality-checked the items.'
  },
  {
    key: 'sent_to_logistics',
    label: 'Reached Logistics',
    shortLabel: 'Logistics',
    emoji: '🏭',
    desc: 'Order was handed to IS&SF logistics hub.'
  },
  {
    key: 'shipped',
    label: 'Shipped / In Transit',
    shortLabel: 'Shipped',
    emoji: '🚚',
    desc: 'Logistics dispatched the order to the customer.'
  },
  {
    key: 'delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    emoji: '🎉',
    desc: 'Order reached the customer and payment was collected.'
  }
];

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  sent_to_logistics: 'With Logistics',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const PAYMENT_LABELS = {
  pending: 'COD Pending',
  pending_payment: 'Delivered - payout pending',
  payout_requested: 'Payout requested',
  paid: 'Paid',
  failed: 'Failed'
};

export function getVisualOrderStatus(orderOrStatus, logisticsStatus) {
  const status = typeof orderOrStatus === 'string' ? orderOrStatus : orderOrStatus?.status;
  const logistics = logisticsStatus ?? (typeof orderOrStatus === 'string' ? null : orderOrStatus?.logisticsStatus);

  if (status === 'cancelled') return 'cancelled';
  if (status === 'delivered' || logistics === 'delivered') return 'delivered';
  if (status === 'shipped' || logistics === 'dispatched' || logistics === 'in_transit') return 'shipped';
  if (status === 'sent_to_logistics' || logistics === 'at_hub') return 'sent_to_logistics';
  if (status === 'packed') return 'packed';
  return status || 'confirmed';
}

export function getFlowIndex(orderOrStatus, logisticsStatus) {
  const visual = getVisualOrderStatus(orderOrStatus, logisticsStatus);
  const index = ORDER_FLOW_STEPS.findIndex((step) => step.key === visual);
  return index >= 0 ? index : 0;
}

export function buildReadableTimeline(order, dispatch) {
  const timeline = Array.isArray(order?.trackingTimeline) ? order.trackingTimeline : [];
  if (timeline.length > 0) return timeline;

  const index = getFlowIndex(order);
  return ORDER_FLOW_STEPS.slice(0, index + 1).map((step) => ({
    id: `${order?.id || dispatch?.id || 'order'}_${step.key}`,
    status: step.key,
    title: step.label,
    message: step.desc,
    actor: step.key === 'confirmed' || step.key === 'packed' ? 'Vendor' : 'Logistics',
    date: order?.date || dispatch?.dispatchDate || 'Today'
  }));
}

export function findDispatchForOrder(dispatches, orderId, source = 'consumer') {
  if (!Array.isArray(dispatches)) return null;
  return dispatches.find((d) => {
    if (source === 'vendor') {
      return d.vendorOrderId === orderId || d.orderId === orderId;
    }
    return d.consumerOrderId === orderId || d.orderId === orderId;
  }) || null;
}
