module.exports = {
    privGroups: [
        {
            id: "USERS",
            name: "User Permissions"
        },
        {
            id: "ROLES",
            name: "Role Permissions"
        },
        {
            id: "CATEGORIES",
            name: "Category Permissions"
        },
        {
            id: "AUDITLOGS",
            name: "AuditLogs Permissions"
        }
    ],

    privileges: [
        {
            key: "users_view",
            name: "User View",
            group: "USERS",
            description: "User view"
        },
        {
            key: "users_add",
            name: "User Add",
            group: "USERS",
            description: "User add"
        },
        {
            key: "users_update",
            name: "User Update",
            group: "USERS",
            description: "User update"
        },
        {
            key: "users_delete",
            name: "User Delete",
            group: "USERS",
            description: "User delete"
        },
        {
            key: "roles_view",
            name: "Role View",
            group: "ROLES",
            description: "Role view"
        },
        {
            key: "roles_add",
            name: "Role Add",
            group: "ROLES",
            description: "Role add"
        },
        {
            key: "roles_update",
            name: "Role Update",
            group: "ROLES",
            description: "Role update"
        },
        {
            key: "roles_delete",
            name: "Role Delete",
            group: "ROLES",
            description: "Role delete"
        },
        {
            key: "category_view",
            name: "Category View",
            group: "CATEGORIES",
            description: "Category view"
        },
        {
            key: "category_add",
            name: "Category Add",
            group: "CATEGORIES",
            description: "Category add"
        },
        {
            key: "category_update",
            name: "Category Update",
            group: "CATEGORIES",
            description: "Category update"
        },
        {
            key: "category_delete",
            name: "Category Delete",
            group: "CATEGORIES",
            description: "Category delete"
        },
        {
            key: "category_export",
            name: "Category Export",
            group: "CATEGORIES",
            description: "Category Export"
        },
        {
            key: "auditlogs_view",
            name: "AuditLogs View",
            group: "AUDITLOGS",
            description: "AuditLogs View"
        }
    ]
}