# InvoiceResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**invoiceNumber** | **string** |  | [optional] [default to undefined]
**issueDate** | **string** |  | [optional] [default to undefined]
**dueDate** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**buyerResponse** | [**BuyerResponse**](BuyerResponse.md) |  | [optional] [default to undefined]
**salesResponse** | [**SalesResponse**](SalesResponse.md) |  | [optional] [default to undefined]
**paymentInvoiceResponse** | [**PaymentInvoiceResponse**](PaymentInvoiceResponse.md) |  | [optional] [default to undefined]
**note** | **string** |  | [optional] [default to undefined]
**salesOrderResponse** | [**SalesOrderResponse**](SalesOrderResponse.md) |  | [optional] [default to undefined]
**userResponse** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { InvoiceResponse } from './api';

const instance: InvoiceResponse = {
    id,
    invoiceNumber,
    issueDate,
    dueDate,
    status,
    totalAmount,
    buyerResponse,
    salesResponse,
    paymentInvoiceResponse,
    note,
    salesOrderResponse,
    userResponse,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
