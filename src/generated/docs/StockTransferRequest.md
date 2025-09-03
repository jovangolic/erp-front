# StockTransferRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**transferDate** | **string** |  | [default to undefined]
**fromStorageId** | **number** |  | [default to undefined]
**toStorageId** | **number** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**itemRequest** | [**Array&lt;StockTransferItemRequest&gt;**](StockTransferItemRequest.md) |  | [optional] [default to undefined]

## Example

```typescript
import { StockTransferRequest } from './api';

const instance: StockTransferRequest = {
    id,
    transferDate,
    fromStorageId,
    toStorageId,
    status,
    itemRequest,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
