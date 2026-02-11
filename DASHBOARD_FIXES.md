# 🔧 Customer Dashboard Issues & Fixes

**Date**: February 11, 2026
**Status**: ✅ **In Progress**

---

## 🐛 Issues Reported

### 1. **Dashboard Notifications Showing Zero** ✅ FIXED

**Issue:**
- Dashboard stats always show "0" notifications even when there are unread notifications

**Root Cause:**
- Backend API (`customerDashboardController.js`) was NOT fetching notifications count
- Only fetched: orders, wishlist, history, support requests

**Fix Applied:**
```javascript
// File: server/controllers/customerDashboardController.js

// Added Notification model import
const Notification = require("../models/Notification");

// Added to Promise.all query:
Notification.countDocuments({ recipient: customerId, read: false }),

// Added to response:
unreadNotificationsCount: unreadNotifications,
```

**Files Modified:**
- ✅ [customerDashboardController.js](server/controllers/customerDashboardController.js)

**Test:**
- Restart server
- Create a notification for the customer
- Check dashboard - should now show correct count

---

### 2. **Rating Symbol Missing on Products** ⏳ TO FIX

**Issue:**
- Product cards used to show rating stars
- Now missing from category page and product listings

**Fix Required:**
Add rating display to ProductCard component in CategoryPage.jsx:

```javascript
// Show rating if product has reviews
{product.rating && product.averageRating > 0 && (
  <div className="flex items-center gap-1">
    <Star size={14} className="fill-yellow-400 text-yellow-400" />
    <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
    <span className="text-xs text-gray-500">({product.numReviews})</span>
  </div>
)}
```

**Files to Modify:**
- client/src/pages/CategoryPage.jsx (ProductCard component around line 640-660)

---

### 3. **Addresses Not in Settings** ⏳ TO FIX

**Issue:**
- `/customer/addresses` page exists but no link from Settings page
- Users can't easily access address management

**Fix Required:**
Add Addresses tab to CustomerSettingsPage.jsx:

```javascript
// Add to tabs array:
{
  id: "addresses",
  label: "Addresses",
  icon: <MapPin size={18} />,
}

// Add Addresses section component
```

**Alternative Solution:**
Add a link in CustomerSettingsPage navigation to redirect to `/customer/addresses`

**Files to Modify:**
- client/src/pages/customer/CustomerSettingsPage.jsx

---

### 4. **Messages Page - No Suppliers Shown** ⏳ TO FIX

**Issue:**
- Chat/Messages page shows: "Start chatting with suppliers from their profile pages"
- But there's NO way to actually start a conversation
- No supplier list available
- Conversations empty

**Root Cause:**
- Chat system expects conversations to already exist
- No UI to initiate new conversations
- Missing supplier list

**Fix Required:**

#### Option 1: Add "Start New Conversation" Button
- Show list of suppliers user has ordered from
- Allow starting new chat

#### Option 2: Integrate with Product/Supplier Pages
- Add "Message Supplier" button on:
  - Product detail pages
  - Supplier profile pages
  - Order details pages

#### Recommended: Both Options

**Implementation:**

1. **Add Supplier List to Messages Page:**
```javascript
// File: client/src/pages/customer/ChatSystem.jsx

// Add new state
const [availableSuppliers, setAvailableSuppliers] = useState([]);
const [showNewChat, setShowNewChat] = useState(false);

// Fetch suppliers user has interacted with
useEffect(() => {
  fetchAvailableSuppliers();
}, []);

const fetchAvailableSuppliers = async () => {
  // Get suppliers from past orders
  const response = await getSuppliersFromOrders();
  setAvailableSuppliers(response.data);
};

// UI for starting new chat
{conversations.length === 0 && (
  <button onClick={() => setShowNewChat(true)}>
    Start New Conversation
  </button>
)}
```

2. **Add "Message Supplier" Button to Product Pages:**
```javascript
// In ProductDetails.jsx and CategoryPage.jsx

<button onClick={() => handleMessageSupplier(product.supplier._id)}>
  <MessageSquare size={18} />
  Message Supplier
</button>

const handleMessageSupplier = (supplierId) => {
  navigate(`/customer/messages?supplier=${supplierId}`);
};
```

**Files to Modify:**
- client/src/pages/customer/ChatSystem.jsx
- client/src/pages/ProductDetails.jsx
- client/src/pages/CategoryPage.jsx (ProductCard)

---

### 5. **No Supplier-Side Messaging** ⏳ TO CREATE

**Issue:**
- Suppliers have no way to view or respond to customer messages
- Chat system is one-sided

**Fix Required:**

Create supplier messaging page:

**New File:** `client/src/pages/supplier/SupplierMessages.jsx`

```javascript
import React, { useState, useEffect } from "react";
import { getConversations, getMessages, sendMessage } from "../../services/supplierApiService";

const SupplierMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Similar structure to ChatSystem.jsx but for suppliers

  return (
    <SupplierLayout>
      {/* Two-column layout: conversations list + chat window */}
    </SupplierLayout>
  );
};
```

**Backend:** Already supported via existing chat APIs

**Files to Create:**
- client/src/pages/supplier/SupplierMessages.jsx
- Add route in App.jsx: `/supplier/messages`
- Add to supplier sidebar navigation

---

## 📝 Implementation Checklist

### Immediate (High Priority)
- [x] Fix notifications count in dashboard API
- [ ] Add rating display to product cards
- [ ] Add Addresses to Settings navigation
- [ ] Add supplier list to Messages page
- [ ] Add "Message Supplier" buttons to product pages

### Soon (Medium Priority)
- [ ] Create supplier-side messaging interface
- [ ] Add message notifications
- [ ] Add unread message badges

### Later (Nice to Have)
- [ ] Real-time messaging with WebSockets
- [ ] Message search
- [ ] File attachments in messages
- [ ] Message templates

---

## 🧪 Testing Instructions

### Test Notifications Count:
1. Restart server (for backend changes)
2. Create a test notification for customer
3. Visit dashboard - verify count shows correctly

### Test Addresses in Settings:
1. Go to `/customer/settings`
2. Should see "Addresses" tab or link
3. Click - should navigate to address management

### Test Messages:
1. Go to `/customer/messages`
2. Should see list of suppliers or "Start New Chat" button
3. Select supplier → should open chat window
4. Send message → should appear in chat
5. As supplier: Go to `/supplier/messages` → see customer messages

---

## 🚀 Quick Fixes Summary

**To fix NOW (requires server restart):**
```bash
# Notifications fix is already done in backend
cd server
# Kill server (Ctrl+C)
npm run dev  # Restart
```

**Frontend fixes needed:**
1. Add `<Star />` rating display to CategoryPage ProductCard
2. Add Addresses link in Settings
3. Modify ChatSystem.jsx to show suppliers list
4. Add "Message Supplier" buttons
5. Create SupplierMessages.jsx page

---

*Report generated: February 11, 2026*
