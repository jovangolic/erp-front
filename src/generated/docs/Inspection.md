# Inspection


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**code** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**inspectionDate** | **string** |  | [optional] [default to undefined]
**batch** | [**Batch**](Batch.md) |  | [optional] [default to undefined]
**product** | [**Product**](Product.md) |  | [optional] [default to undefined]
**inspector** | [**User**](User.md) |  | [optional] [default to undefined]
**quantityInspected** | **number** |  | [optional] [default to undefined]
**quantityAccepted** | **number** |  | [optional] [default to undefined]
**quantityRejected** | **number** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**result** | **string** |  | [optional] [default to undefined]
**qualityCheck** | [**QualityCheck**](QualityCheck.md) |  | [optional] [default to undefined]
**defects** | [**Array&lt;InspectionDefect&gt;**](InspectionDefect.md) |  | [optional] [default to undefined]
**measurements** | [**Array&lt;TestMeasurement&gt;**](TestMeasurement.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]
**consistent** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { Inspection } from './api';

const instance: Inspection = {
    id,
    code,
    type,
    inspectionDate,
    batch,
    product,
    inspector,
    quantityInspected,
    quantityAccepted,
    quantityRejected,
    notes,
    result,
    qualityCheck,
    defects,
    measurements,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
    consistent,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
