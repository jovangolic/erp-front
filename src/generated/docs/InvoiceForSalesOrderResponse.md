# InvoiceForSalesOrderResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**invoiceNumber** | **string** |  | [optional] [default to undefined]
**issueDate** | **string** |  | [optional] [default to undefined]
**dueDate** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**salesResponse** | [**SalesResponse**](SalesResponse.md) |  | [optional] [default to undefined]
**paymentInvoiceResponse** | [**PaymentInvoiceResponse**](PaymentInvoiceResponse.md) |  | [optional] [default to undefined]
**note** | **string** |  | [optional] [default to undefined]
**userResponse** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { InvoiceForSalesOrderResponse } from './api';

const instance: InvoiceForSalesOrderResponse = {
    id,
    invoiceNumber,
    issueDate,
    dueDate,
    status,
    totalAmount,
    salesResponse,
    paymentInvoiceResponse,
    note,
    userResponse,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
