# StockTransfer


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**transferDate** | **string** |  | [optional] [default to undefined]
**fromStorage** | [**Storage**](Storage.md) |  | [optional] [default to undefined]
**toStorage** | [**Storage**](Storage.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**items** | [**Array&lt;StockTransferItem&gt;**](StockTransferItem.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { StockTransfer } from './api';

const instance: StockTransfer = {
    id,
    transferDate,
    fromStorage,
    toStorage,
    status,
    items,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
