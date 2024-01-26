import { Permission } from './rolePermissionCheck';

describe('Check the permissions form users', () => {
    const checkRoleUser = new Permission('Tom');

    test('checkRolePermissions returns fals for invalid admin role', async () => {
        const result = await checkRoleUser.checkRolePermissions('testbutton');
        expect(result).toBe(false);
    });

});
