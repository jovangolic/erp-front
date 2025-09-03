# SalesRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**buyerId** | **number** |  | [default to undefined]
**itemSales** | [**Array&lt;ItemSalesRequest&gt;**](ItemSalesRequest.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**totalPrice** | **number** |  | [default to undefined]
**salesDescription** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { SalesRequest } from './api';

const instance: SalesRequest = {
    id,
    buyerId,
    itemSales,
    createdAt,
    totalPrice,
    salesDescription,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
