# Inventory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**storageEmployee** | [**User**](User.md) |  | [optional] [default to undefined]
**storageForeman** | [**User**](User.md) |  | [optional] [default to undefined]
**date** | **string** |  | [optional] [default to undefined]
**aligned** | **boolean** |  | [optional] [default to undefined]
**inventoryItems** | [**Array&lt;InventoryItems&gt;**](InventoryItems.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Inventory } from './api';

const instance: Inventory = {
    id,
    storageEmployee,
    storageForeman,
    date,
    aligned,
    inventoryItems,
    status,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
