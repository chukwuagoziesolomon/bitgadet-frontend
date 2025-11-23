# Order Summary API Endpoint

## Endpoint Details

**URL:** `/api/orders/summary/`  
**Method:** `GET`  
**Authentication:** Optional (works for both authenticated users and guests)  
**Response Format:** JSON

## Response Structure

```json
{
  "total_orders": 4,
  "total_revenue": 118.08,
  "total_shipping_fee": 0.0,
  "average_order_value": 29.52,
  "currency": "USD",
  "cart_token": "test-token-123",
  "note": "Login to see your personal order statistics",
  "auth_type": "guest"
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `total_orders` | integer | Total number of orders placed by this user/session |
| `total_revenue` | number | Total revenue from all orders (in specified currency) |
| `total_shipping_fee` | number | Total shipping fees paid across all orders |
| `average_order_value` | number | Average value per order |
| `currency` | string | Currency code (e.g., "USD", "NGN") |
| `cart_token` | string | Guest session cart token (if applicable) |
| `note` | string | Additional information or message |
| `auth_type` | string | Authentication type: "user" (authenticated) or "guest" (unauthenticated) |

## Usage Examples

### JavaScript/TypeScript

```typescript
import { dashboardService } from '../services/dashboardService';

// Fetch order summary statistics
try {
  const stats = await dashboardService.getOrderSummaryStats();
  console.log(`Total Orders: ${stats.total_orders}`);
  console.log(`Total Revenue: ${stats.currency} ${stats.total_revenue}`);
  console.log(`Average Order: ${stats.currency} ${stats.average_order_value}`);
} catch (error) {
  console.error('Failed to fetch stats:', error);
}
```

### Raw API Call

```typescript
const response = await conditionalApiRequest('/api/orders/summary/');
console.log(response);
```

## Related Endpoints

### `/api/cart/summary/` - Cart/Checkout Summary
Used during checkout to get cart totals for transaction processing.

**Returns:** Cart items, subtotal, shipping, tax, discount, total

### `/api/user/order-stats/` - Authenticated User Order Statistics
Used on user dashboard for detailed order analytics.

**Returns:** Detailed statistics specific to authenticated user

### `/api/orders/summary/` - Aggregate Order Summary
Used for general commerce statistics and guest analytics.

**Returns:** Overview statistics (total_orders, total_revenue, average_order_value)

## Implementation Details

### In Checkout Component
- The checkout page uses `/api/cart/summary/` for real-time cart totals
- This endpoint displays current checkout totals (subtotal, shipping, tax, discount)
- Different from ORDER_SUMMARY which is for statistics

### In Dashboard Service
- New `dashboardService` provides helper methods for stats
- Can be used to display commerce analytics
- Works for both authenticated and guest users

### Configuration
- Endpoint is defined in `API_CONFIG.ENDPOINTS.ORDER_SUMMARY_STATS`
- Also referred as `/api/orders/summary/` in `needsNoCredentials()` check
- No credentials required (supports guest access)

## Error Handling

```typescript
try {
  const stats = await dashboardService.getOrderSummaryStats();
} catch (error: any) {
  const errorMessage = handleApiError(error, 'Order Summary Stats');
  showError('Failed to load statistics', errorMessage);
}
```

## Notes

- For **guest users**: Returns aggregate data for the guest session
- For **authenticated users**: Can return user-specific data if backend supports it
- The `note` field may provide context about data privacy/availability
- `cart_token` is included for guest session tracking

## File References

- **API Config:** `src/config/api.ts` - Line 57 (ORDER_SUMMARY_STATS)
- **Dashboard Service:** `src/services/dashboardService.ts` - Helper functions
- **Checkout Component:** `src/components/Checkout.tsx` - Uses CART_SUMMARY endpoint
- **API Response Handler:** `src/utils/errorHandler.ts` - Error extraction

## Testing

To test this endpoint directly:

```bash
# Guest user (no auth)
curl http://localhost:8000/api/orders/summary/

# Authenticated user
curl -H "Authorization: Token YOUR_TOKEN" http://localhost:8000/api/orders/summary/
```

Response for each:
- Guest: Shows aggregate/guest session stats
- Authenticated: Shows user-specific stats
