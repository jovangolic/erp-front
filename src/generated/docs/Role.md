# Role


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**roleTypes** | **string** |  | [optional] [default to undefined]
**users** | [**Array&lt;User&gt;**](User.md) |  | [optional] [default to undefined]
**permissions** | [**Set&lt;Permission&gt;**](Permission.md) |  | [optional] [default to undefined]
**nameAsString** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Role } from './api';

const instance: Role = {
    id,
    name,
    roleTypes,
    users,
    permissions,
    nameAsString,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
