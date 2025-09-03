# Invoice


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**invoiceNumber** | **string** |  | [optional] [default to undefined]
**issueDate** | **string** |  | [optional] [default to undefined]
**dueDate** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**buyer** | [**Buyer**](Buyer.md) |  | [optional] [default to undefined]
**relatedSales** | [**Sales**](Sales.md) |  | [optional] [default to undefined]
**payment** | [**Payment**](Payment.md) |  | [optional] [default to undefined]
**note** | **string** |  | [optional] [default to undefined]
**salesOrder** | [**SalesOrder**](SalesOrder.md) |  | [optional] [default to undefined]
**createdBy** | [**User**](User.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdByUser** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Invoice } from './api';

const instance: Invoice = {
    id,
    invoiceNumber,
    issueDate,
    dueDate,
    status,
    totalAmount,
    buyer,
    relatedSales,
    payment,
    note,
    salesOrder,
    createdBy,
    createdAt,
    modifiedAt,
    createdByUser,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
