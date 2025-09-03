# RoleResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**permissions** | [**Set&lt;PermissionResponse&gt;**](PermissionResponse.md) |  | [optional] [default to undefined]
**users** | [**Array&lt;UserResponse&gt;**](UserResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { RoleResponse } from './api';

const instance: RoleResponse = {
    id,
    name,
    type,
    permissions,
    users,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
