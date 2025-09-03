# MaterialMovementResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**material** | [**MaterialResponse**](MaterialResponse.md) |  | [optional] [default to undefined]
**movementDate** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**quantity** | **number** |  | [optional] [default to undefined]
**fromStorage** | [**StorageBasicResponse**](StorageBasicResponse.md) |  | [optional] [default to undefined]
**toStorage** | [**StorageBasicResponse**](StorageBasicResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { MaterialMovementResponse } from './api';

const instance: MaterialMovementResponse = {
    id,
    material,
    movementDate,
    type,
    quantity,
    fromStorage,
    toStorage,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
