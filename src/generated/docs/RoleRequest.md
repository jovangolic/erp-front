# RoleRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**roleTypes** | **string** |  | [default to undefined]
**users** | [**Array&lt;User&gt;**](User.md) |  | [optional] [default to undefined]
**permissionIds** | **Set&lt;number&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { RoleRequest } from './api';

const instance: RoleRequest = {
    id,
    name,
    roleTypes,
    users,
    permissionIds,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
