# Memory GOTO Fix - Testing Instructions

## 🔧 **FIXES APPLIED:**

### 1. **Enhanced Address Parsing**
- **Handles $ prefix** - Both `$0200` and `0200` work
- **Trim whitespace** - Removes leading/trailing spaces
- **Better error handling** - Shows helpful error messages
- **Console logging** - Debug information for troubleshooting

### 2. **Improved Error Handling**
- **Invalid address detection** - Shows user-friendly error
- **NaN checking** - Prevents crashes
- **Alert messages** - Clear feedback for invalid input
- **Console debugging** - Technical details for developers

### 3. **Enhanced Debugging**
- **Function call logging** - Confirms button clicks work
- **Address parsing logs** - Shows input processing
- **Memory view updates** - Confirms display refresh
- **Element existence checks** - Prevents null reference errors

## 🧪 **TESTING PROCEDURE:**

### **Step 1: Open Browser Console**
1. Open http://localhost:8000
2. Press **F12** to open developer tools
3. Go to **Console** tab

### **Step 2: Test GOTO Function**
1. In memory address field, type: `$0200`
2. Click **Goto** button
3. Check console for log messages:
   ```
   gotoMemoryAddress called
   Input value: $0200
   Parsed address: 512
   Goto memory address: $0200
   Updating memory view, start address: $0200
   Memory view updated with 16 rows
   ```

### **Step 3: Verify Memory Display**
1. Memory view should show addresses starting at `$0200`
2. First row should be: `$0200 | 00 00 00 00...`
3. Address input should update to show `$0200`

### **Step 4: Test Different Formats**
1. Try `0300` (without $)
2. Try `$1000`
3. Try invalid input like `XYZ` - should show error

## 🐛 **TROUBLESHOOTING:**

### **If GOTO Still Doesn't Work:**

1. **Check Console Logs:**
   - Look for "gotoMemoryAddress called"
   - Check for error messages
   - Verify address parsing

2. **Verify HTML Elements:**
   - Ensure input has `id="memoryAddr"`
   - Ensure button has `id="gotoMemoryBtn"`
   - Check for JavaScript errors

3. **Test Event Listeners:**
   - Click button and watch console
   - Try pressing Enter in input field
   - Check for "gotoMemoryAddress called" message

4. **Manual Test:**
   ```javascript
   // In browser console, try:
   debuggerUI.gotoMemoryAddress();
   ```

## 🎯 **EXPECTED BEHAVIOR:**

### **Working Correctly:**
- ✅ Button click triggers function
- ✅ Address parsed with/without $ prefix
- ✅ Memory view updates to new location
- ✅ Input field shows new address
- ✅ No error messages in console

### **Common Issues:**
- ❌ No console log when clicking → Event listener issue
- ❌ Invalid address error → Parsing problem
- ❌ Memory doesn't update → Display function issue
- ❌ Input field doesn't change → Update function issue

## 📋 **DEBUG CHECKLIST:**

- [ ] Console shows "gotoMemoryAddress called" when clicking Goto
- [ ] Address parsing works for `$0200` format
- [ ] Address parsing works for `0200` format
- [ ] Memory view scrolls to new location
- [ ] Input field updates with new address
- [ ] No JavaScript errors in console

Test this now and check the browser console for debugging information!