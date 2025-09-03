# StorageRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**location** | **string** |  | [optional] [default to undefined]
**capacity** | **number** |  | [default to undefined]
**type** | **string** |  | [default to undefined]
**shelves** | [**Array&lt;ShelfRequest&gt;**](ShelfRequest.md) |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]
**hasShelvesFor** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { StorageRequest } from './api';

const instance: StorageRequest = {
    id,
    name,
    location,
    capacity,
    type,
    shelves,
    status,
    hasShelvesFor,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
