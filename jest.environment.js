const mockTimestampEntityFields = entity => {
    if (entity.createdAt) {
        entity.createdAt = 'mockCreatedAtTimestamp';
    }

    if (entity.updatedAt) {
        entity.updatedAt = 'mockUpdatedAtTimestamp';
    }
};

const printEntity = entity => {
    mockTimestampEntityFields(entity);

    if (entity.versions && Array.isArray(entity.versions)) {
        entity.versions.forEach(mockTimestampEntityFields);
    }

    return JSON.stringify(entity, null, 2);
};

expect.addSnapshotSerializer({
    test: val => val.id && (val.createdAt || val.updatedAt),
    print: printEntity
});
