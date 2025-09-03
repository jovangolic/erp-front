# InventoryRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**storageEmployeeId** | **number** |  | [default to undefined]
**storageForemanId** | **number** |  | [default to undefined]
**date** | **string** |  | [default to undefined]
**aligned** | **boolean** |  | [default to undefined]
**inventoryItems** | [**Array&lt;InventoryItemsRequest&gt;**](InventoryItemsRequest.md) |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]

## Example

```typescript
import { InventoryRequest } from './api';

const instance: InventoryRequest = {
    id,
    storageEmployeeId,
    storageForemanId,
    date,
    aligned,
    inventoryItems,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
