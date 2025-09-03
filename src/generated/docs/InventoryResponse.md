# InventoryResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**storageEmployeeForUserResponse** | [**StorageEmployeeForUserResponse**](StorageEmployeeForUserResponse.md) |  | [optional] [default to undefined]
**storageForemanForUserResponse** | [**StorageForemanForUserResponse**](StorageForemanForUserResponse.md) |  | [optional] [default to undefined]
**date** | **string** |  | [optional] [default to undefined]
**aligned** | **boolean** |  | [optional] [default to undefined]
**inventoryItems** | [**Array&lt;InventoryItemsResponse&gt;**](InventoryItemsResponse.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { InventoryResponse } from './api';

const instance: InventoryResponse = {
    id,
    storageEmployeeForUserResponse,
    storageForemanForUserResponse,
    date,
    aligned,
    inventoryItems,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
