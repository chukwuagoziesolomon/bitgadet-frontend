# Coupon Validation - API Specification & Examples

## 📡 API Endpoint Specification

### Endpoint Details

```
Method:    POST
URL:       /api/coupons/validate/
Auth:      Optional (can work without auth)
CORS:      Must allow frontend requests
Timeout:   10 seconds (recommended)
Rate:      Implement rate limiting (recommended)
```

---

## 📤 Request Format

### HTTP Headers

```http
POST /api/coupons/validate/ HTTP/1.1
Host: your-backend.com
Content-Type: application/json
Authorization: Token <token> (if auth required)
X-CSRFToken: <csrf_token> (for CSRF protection)
```

### Request Body

```json
{
  "coupon_code": "SAVE20",
  "user_email": "customer@example.com"
}
```

### Parameter Details

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `coupon_code` | string | Yes | Coupon code to validate | "SAVE20" |
| `user_email` | string | Yes | Customer email | "user@example.com" |

### Validation Rules

- `coupon_code`: Non-empty string, typically uppercase (frontend converts)
- `user_email`: Valid email format
- Both fields are required, return 400 if missing

---

## 📥 Response Format

### Success Response (HTTP 200)

```json
{
  "success": true,
  "coupon_code": "SAVE20",
  "discount_type": "percentage",
  "discount_value": 20,
  "discount_amount": 1000.00,
  "final_amount": 4000.00
}
```

#### Response Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `success` | boolean | Request succeeded | `true` |
| `coupon_code` | string | Applied coupon code | `"SAVE20"` |
| `discount_type` | string | Type of discount | `"percentage"` or `"fixed"` |
| `discount_value` | number | Discount value | `20` (for 20%) or `1000` (₦1,000) |
| `discount_amount` | float | Calculated discount in currency | `1000.00` |
| `final_amount` | float | Order total after discount | `4000.00` |

### Success Response Examples

#### Example 1: Percentage Discount
```json
{
  "success": true,
  "coupon_code": "SAVE20",
  "discount_type": "percentage",
  "discount_value": 20,
  "discount_amount": 1000.00,
  "final_amount": 4000.00
}
```

**User sees:**
- Code: SAVE20
- Discount: 20% off
- Savings: -₦1,000
- Final Amount: ₦4,000

#### Example 2: Fixed Amount Discount
```json
{
  "success": true,
  "coupon_code": "SAVE1000",
  "discount_type": "fixed",
  "discount_value": 1000,
  "discount_amount": 1000.00,
  "final_amount": 4000.00
}
```

**User sees:**
- Code: SAVE1000
- Discount: ₦1,000 off
- Savings: -₦1,000
- Final Amount: ₦4,000

---

## ❌ Error Response (HTTP 200 with success: false)

### Basic Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Scenarios

#### Scenario 1: Coupon Not Found
```json
{
  "success": false,
  "message": "Coupon code not found"
}
```

#### Scenario 2: Coupon Expired
```json
{
  "success": false,
  "message": "This coupon has expired"
}
```

#### Scenario 3: Usage Limit Exceeded
```json
{
  "success": false,
  "message": "This coupon has reached its usage limit"
}
```

#### Scenario 4: Coupon Not Active
```json
{
  "success": false,
  "message": "This coupon is not currently active"
}
```

#### Scenario 5: Minimum Order Not Met
```json
{
  "success": false,
  "message": "Minimum order amount required: ₦5,000"
}
```

#### Scenario 6: Invalid Email
```json
{
  "success": false,
  "message": "Email address is invalid"
}
```

#### Scenario 7: Coupon Already Used By Customer
```json
{
  "success": false,
  "message": "You have already used this coupon"
}
```

---

## 🔄 Request-Response Flow Examples

### Example 1: Valid Percentage Coupon

**Request:**
```bash
curl -X POST http://localhost:8000/api/coupons/validate/ \
  -H "Content-Type: application/json" \
  -d '{"coupon_code":"SAVE20","user_email":"john@example.com"}'
```

**Response:**
```json
{
  "success": true,
  "coupon_code": "SAVE20",
  "discount_type": "percentage",
  "discount_value": 20,
  "discount_amount": 1000.00,
  "final_amount": 4000.00
}
```

**Frontend shows:**
```
✓ SAVE20: 20% off
  Discount: -₦1,000
  Final Amount: ₦4,000
```

---

### Example 2: Valid Fixed Coupon

**Request:**
```bash
curl -X POST http://localhost:8000/api/coupons/validate/ \
  -H "Content-Type: application/json" \
  -d '{"coupon_code":"SAVE1000","user_email":"jane@example.com"}'
```

**Response:**
```json
{
  "success": true,
  "coupon_code": "SAVE1000",
  "discount_type": "fixed",
  "discount_value": 1000,
  "discount_amount": 1000.00,
  "final_amount": 4000.00
}
```

**Frontend shows:**
```
✓ SAVE1000: ₦1,000 off
  Discount: -₦1,000
  Final Amount: ₦4,000
```

---

### Example 3: Invalid Coupon

**Request:**
```bash
curl -X POST http://localhost:8000/api/coupons/validate/ \
  -H "Content-Type: application/json" \
  -d '{"coupon_code":"INVALID123","user_email":"bob@example.com"}'
```

**Response:**
```json
{
  "success": false,
  "message": "Coupon code not found"
}
```

**Frontend shows:**
```
❌ Error: Coupon code not found
[User can retry]
```

---

### Example 4: Expired Coupon

**Request:**
```bash
curl -X POST http://localhost:8000/api/coupons/validate/ \
  -H "Content-Type: application/json" \
  -d '{"coupon_code":"OLDCODE","user_email":"alice@example.com"}'
```

**Response:**
```json
{
  "success": false,
  "message": "This coupon has expired"
}
```

**Frontend shows:**
```
❌ Error: This coupon has expired
[User can try another code]
```

---

### Example 5: Usage Limit Exceeded

**Request:**
```bash
curl -X POST http://localhost:8000/api/coupons/validate/ \
  -H "Content-Type: application/json" \
  -d '{"coupon_code":"LIMITED","user_email":"charlie@example.com"}'
```

**Response:**
```json
{
  "success": false,
  "message": "This coupon has reached its usage limit"
}
```

**Frontend shows:**
```
❌ Error: This coupon has reached its usage limit
[Coupon not available]
```

---

## 🛠️ Backend Implementation Checklist

### Validation Steps
- [ ] Coupon code not empty
- [ ] User email valid format
- [ ] Coupon exists in database
- [ ] Coupon is_active = True
- [ ] Current date < coupon expiry_date
- [ ] Usage count < usage_limit (if limit exists)
- [ ] User hasn't already used this coupon (if one-per-user)
- [ ] Order value >= minimum_order_amount (if minimum exists)

### Calculation Steps
- [ ] Parse discount_type (percentage or fixed)
- [ ] If percentage: calculate `discount_amount = order_total * (discount_value / 100)`
- [ ] If fixed: use `discount_amount = discount_value`
- [ ] Calculate `final_amount = order_total - discount_amount`
- [ ] Ensure final_amount >= 0

### Response Steps
- [ ] Return success: true
- [ ] Include all required fields
- [ ] Use correct data types (number, string, boolean)
- [ ] Format currency as float (e.g., 1000.00)
- [ ] Return coupon code as entered

### Error Handling
- [ ] If validation fails: return success: false
- [ ] Include descriptive message
- [ ] Don't expose sensitive data
- [ ] Handle missing parameters
- [ ] Handle invalid email format

---

## 🔐 Security Considerations

### Rate Limiting
```
Recommended: 5-10 requests per email per minute
Prevents: Brute force coupon discovery
Implementation: Use Django throttling or equivalent
```

### CSRF Protection
```
Required: X-CSRFToken header in POST request
Provided by: Django CSRF middleware
Frontend: Automatically included by conditionalApiRequest
```

### Authentication (Optional)
```
Can require: Authentication token for higher trust
Or allow: Anonymous requests with email validation
Recommendation: Allow anonymous but track by email
```

### Input Validation
```
Coupon code: Only alphanumeric and special chars (-, _)
Email: Valid email format, no SQL injection
Length limits: code ≤20 chars, email ≤254 chars
```

---

## 📊 Database Schema Suggestion

### Coupon Model

```python
class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(
        max_length=20, 
        choices=[('percentage', 'Percentage'), ('fixed', 'Fixed Amount')]
    )
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    
    # Activation
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    # Limits
    usage_limit = models.IntegerField(null=True, blank=True)  # None = unlimited
    usage_count = models.IntegerField(default=0)
    minimum_order_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.code

class CouponUsage(models.Model):
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE)
    email = models.EmailField()
    used_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('coupon', 'email')  # One use per email
```

---

## ⏱️ Performance Guidelines

### Optimization Tips
- Index coupon code field: `code` → O(1) lookup
- Cache active coupons (update on POST)
- Validate expiry with database query
- Limit usage_count check to necessary coupons only
- Consider query optimization for high traffic

### Recommended Caching
```python
# Cache active coupons for 1 hour
cache.set('active_coupons', coupons, timeout=3600)

# Invalidate on coupon update
signals.post_save.connect(invalidate_coupon_cache, sender=Coupon)
```

---

## 🧪 Testing Examples

### Unit Test: Valid Coupon
```python
def test_validate_coupon_valid_percentage():
    coupon = Coupon.objects.create(
        code='TEST20',
        discount_type='percentage',
        discount_value=20,
        is_active=True,
        end_date=timezone.now() + timedelta(days=30)
    )
    
    response = client.post('/api/coupons/validate/', {
        'coupon_code': 'TEST20',
        'user_email': 'test@example.com'
    })
    
    assert response.status_code == 200
    assert response.json()['success'] == True
    assert response.json()['discount_value'] == 20
```

### Unit Test: Invalid Coupon
```python
def test_validate_coupon_invalid():
    response = client.post('/api/coupons/validate/', {
        'coupon_code': 'NOTEXIST',
        'user_email': 'test@example.com'
    })
    
    assert response.status_code == 200
    assert response.json()['success'] == False
    assert 'not found' in response.json()['message'].lower()
```

### Integration Test: Full Flow
```python
def test_coupon_checkout_flow():
    # 1. Create coupon
    coupon = Coupon.objects.create(...)
    
    # 2. Validate coupon
    response = client.post('/api/coupons/validate/', {...})
    assert response.json()['success'] == True
    
    # 3. Create order with coupon
    order_response = client.post('/api/checkout/create/', {
        'coupon_code': 'TEST20',
        'total_amount': 4000
    })
    
    # 4. Verify coupon usage recorded
    assert CouponUsage.objects.filter(email='test@example.com').exists()
```

---

## 📋 Deployment Checklist

- [ ] Endpoint implemented and tested locally
- [ ] Database migrations applied
- [ ] Test coupons created
- [ ] CORS headers configured
- [ ] CSRF middleware enabled
- [ ] Rate limiting configured
- [ ] Error messages reviewed (user-friendly)
- [ ] Logging implemented
- [ ] Performance tested with load
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Frontend tested against endpoint
- [ ] Staging environment verified
- [ ] Production deployment plan ready

---

## 📞 Support & Questions

**Frontend is expecting:**
1. POST endpoint at `/api/coupons/validate/`
2. JSON request body with coupon_code and user_email
3. JSON response with success boolean and discount details
4. Consistent error messages

**Implement exactly as specified above and frontend will work perfectly!**

