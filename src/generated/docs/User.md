# User


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**firstName** | **string** |  | [optional] [default to undefined]
**lastName** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**password** | **string** |  | [optional] [default to undefined]
**phoneNumber** | **string** |  | [optional] [default to undefined]
**address** | **string** |  | [optional] [default to undefined]
**roles** | [**Array&lt;Role&gt;**](Role.md) |  | [optional] [default to undefined]
**username** | **string** |  | [optional] [default to undefined]
**employeeInventories** | [**Set&lt;Inventory&gt;**](Inventory.md) |  | [optional] [default to undefined]
**foremanInventories** | [**Set&lt;Inventory&gt;**](Inventory.md) |  | [optional] [default to undefined]
**scannedBarCodes** | [**Set&lt;BarCode&gt;**](BarCode.md) |  | [optional] [default to undefined]

## Example

```typescript
import { User } from './api';

const instance: User = {
    id,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    roles,
    username,
    employeeInventories,
    foremanInventories,
    scannedBarCodes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
