import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RbacAssignmentsTab } from "@/features/rbac/components/rbac-assignments-tab";
import { RbacPermissionsTab } from "@/features/rbac/components/rbac-permissions-tab";
import { RbacRolesTab } from "@/features/rbac/components/rbac-roles-tab";

export function RbacPage() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Administração RBAC disponível apenas para usuários com papel Admin.
      </p>

      <Tabs defaultValue="permissions" className="gap-6">
        <TabsList>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="roles">Papéis</TabsTrigger>
          <TabsTrigger value="assignments">Vínculos</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-6">
          <RbacPermissionsTab />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <RbacRolesTab />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <RbacAssignmentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
