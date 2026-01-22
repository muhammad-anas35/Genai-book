# API دستاویزات (Documentation)

## بیس URL

- **ڈیولپمنٹ**: `http://localhost:4000`
- **پروڈکشن**: `https://your-domain.com`

## رجسٹریشن اور لاگ ان (Authentication)

تمام محفوظ اینڈ پوائنٹس کے لیے سیشن کوکیز کے ذریعے رجسٹریشن ضروری ہے۔

### سائن اپ (Sign Up)

**POST** `/api/auth/signup/email`

نیا اکاؤنٹ بنائیں۔

**درخواست (Request)**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

### سائن ان (Sign In)

**POST** `/api/auth/signin/email`

اکاؤنٹ میں لاگ ان کریں۔

---

## محفوظ اینڈ پوائنٹس (Protected Endpoints)

### چیٹ میسج بھیجیں (Send Chat Message)

**POST** `/api/chat`

میسج بھیجیں اور RAG کے ذریعے AI جواب حاصل کریں۔

**درخواست**:
```json
{
  "message": "What is ROS 2?",
  "chapter": "chapter2"
}
```

**جواب (Response)**:
جواب میں AI کا تیار کردہ مواد اور ان معلومات کے ذرائع (Sources) شامل ہوں گے۔

### چیٹ ہسٹری (Chat History)

**GET** `/api/chat/history`

صارف کی پچھلی گفتگو کی فہرست حاصل کریں۔

---

## غلطی کے جوابات (Error Responses)

**401 Unauthorized**:
اگر صارف لاگ ان نہیں ہے تو یہ پیغام موصول ہوگا کہ براہ کرم پہلے لاگ ان کریں۔

**500 Internal Server Error**:
اگر سرور میں کوئی فنی خرابی ہو تو یہ پیغام موصول ہوگا کہ دوبارہ کوشش کریں۔
