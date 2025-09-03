# SalesOrder


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**orderNumber** | **string** |  | [optional] [default to undefined]
**orderDate** | **string** |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**buyer** | [**Buyer**](Buyer.md) |  | [optional] [default to undefined]
**items** | [**Array&lt;ItemSales&gt;**](ItemSales.md) |  | [optional] [default to undefined]
**invoice** | [**Invoice**](Invoice.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**note** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { SalesOrder } from './api';

const instance: SalesOrder = {
    id,
    orderNumber,
    orderDate,
    totalAmount,
    buyer,
    items,
    invoice,
    status,
    note,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
