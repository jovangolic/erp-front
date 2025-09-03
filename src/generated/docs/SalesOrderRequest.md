# SalesOrderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**buyerId** | **number** |  | [default to undefined]
**items** | [**Array&lt;ItemSalesRequest&gt;**](ItemSalesRequest.md) |  | [optional] [default to undefined]
**orderDate** | **string** |  | [default to undefined]
**totalAmount** | **number** |  | [default to undefined]
**note** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]
**invoiceId** | **number** |  | [optional] [default to undefined]
**orderNumber** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { SalesOrderRequest } from './api';

const instance: SalesOrderRequest = {
    id,
    buyerId,
    items,
    orderDate,
    totalAmount,
    note,
    status,
    invoiceId,
    orderNumber,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
