# StockTransferResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**transferDate** | **string** |  | [optional] [default to undefined]
**fromStorage** | [**FromStorageResponse**](FromStorageResponse.md) |  | [optional] [default to undefined]
**toStorage** | [**ToStorageResponse**](ToStorageResponse.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**itemResponse** | [**Array&lt;StockTransferItemResponse&gt;**](StockTransferItemResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { StockTransferResponse } from './api';

const instance: StockTransferResponse = {
    id,
    transferDate,
    fromStorage,
    toStorage,
    status,
    itemResponse,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
