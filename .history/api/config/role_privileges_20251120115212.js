module.exports = {
    privGroups: [
        {
            id: "USERS",
            name: "User Permission"
        },
        {
            id: "ROLES",
            name: "Role Permission"
        },
        {
            id: "CATEGORİES",
            name: "Categories Permission"
        },
        {
            id: "AUDITLOGS",
            name: "Auditlogs Permission"
        },
    ],

    privileges: [
        {
            key: "user_view",
            name: "User View",
            group: "USERS",
            description: "User View"
        },
        {
            key: "user_add",
            name: "User Add",
            group: "USERS",
            description: "User Add"
        },
        {
            key: "user_update",
            name: "User Update",
            group: "USERS",
            description: "User Update"
        },
        {
            key: "user_delete",
            name: "User Delete",
            group: "USERS",
            description: "User Delete"
        },
        {
            key: "role_view",
            name: "Role View",
            group: "ROLES",
            description: "Role View"
        },
        {
            key: "role_add",
            name: "Role Add",
            group: "ROLES",
            description: "Role Add"
        },
        {
            key: "role_update",
            name: "Role Update",
            group: "ROLES",
            description: "Role Update"
        },
        {
            key: "role_delete",
            name: "Role Delete",
            group: "ROLES",
            description: "Role Delete"
        },
        {
            key: "category_view",
            name: "Categories View",
            group: "CATEGORİES",
            description: "Categories View"
        },
        {
            key: "category_add",
            name: "Categories Add",
            group: "CATEGORİES",
            description: "Categories Add"
        },
        {
            key: "category_update",
            name: "Categories Update",
            group: "CATEGORİES",
            description: "Categories Update"
        },
        {
            key: "category_delete",
            name: "Categories Delete",
            group: "CATEGORİES",
            description: "Categories Delete"
        },
          {
            key: "auditlogs_view",
            name: "Auditlogs View",
            group: "AUDİTLOGS",
            description: "Auditlogs View"
        }
    ]
}