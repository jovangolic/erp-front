# TransactionResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**transactionDate** | **string** |  | [optional] [default to undefined]
**transactionType** | **string** |  | [optional] [default to undefined]
**sourceAccountResponse** | [**SourceAccountResponse**](SourceAccountResponse.md) |  | [optional] [default to undefined]
**targetAccountResponse** | [**TargetAccountResponse**](TargetAccountResponse.md) |  | [optional] [default to undefined]
**userResponse** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TransactionResponse } from './api';

const instance: TransactionResponse = {
    id,
    amount,
    transactionDate,
    transactionType,
    sourceAccountResponse,
    targetAccountResponse,
    userResponse,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
