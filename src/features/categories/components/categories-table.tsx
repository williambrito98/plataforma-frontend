import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionCodes } from "@/features/auth/constants/permissions";
import { useCan } from "@/features/auth/hooks/use-can";
import { inputClassName } from "@/features/categories/components/categories-form-styles";
import { DeleteCategoryDialog } from "@/features/categories/components/delete-category-dialog";
import {
  useDeleteCategory,
  useUpdateCategory,
} from "@/features/categories/hooks/use-categories-admin";
import { categoryNameSchema } from "@/features/categories/schemas/category-name-schema";
import type { Category } from "@/features/categories/types/category";
import { formatFileDate } from "@/features/files/utils/format-file-date";

type CategoriesTableProps = {
  categories: Category[];
  isLoading: boolean;
};

type CategoryToDelete = {
  id: string;
  name: string;
};

export function CategoriesTable({
  categories,
  isLoading,
}: CategoriesTableProps) {
  const canUpdate = useCan(PermissionCodes.CATEGORIES_UPDATE);
  const canDelete = useCan(PermissionCodes.CATEGORIES_DELETE);
  const showActions = canUpdate || canDelete;

  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryToDelete | null>(null);

  const columnCount = showActions ? 3 : 2;

  function startEditing(category: Category) {
    setEditingId(category.id);
    setEditedName(category.name);
    setEditError(null);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditedName("");
    setEditError(null);
  }

  async function saveEditing(categoryId: string) {
    const parsed = categoryNameSchema.safeParse({ name: editedName });

    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message ?? "Nome inválido");
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id: categoryId,
        name: parsed.data.name,
      });
      cancelEditing();
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  async function handleConfirmDelete() {
    if (!categoryToDelete) {
      return;
    }

    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      setCategoryToDelete(null);
    } catch {
      // Erro tratado pelo hook via toast.
    }
  }

  return (
    <>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-foreground">
            Categorias cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Criado em</TableHead>
                {showActions ? (
                  <TableHead className="text-right">Ações</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="text-muted-foreground"
                  >
                    Carregando categorias...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="text-muted-foreground"
                  >
                    Nenhuma categoria encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => {
                  const isEditing = editingId === category.id;

                  return (
                    <TableRow key={category.id}>
                      <TableCell className="text-foreground">
                        {isEditing ? (
                          <div className="space-y-1">
                            <Input
                              value={editedName}
                              onChange={(event) => {
                                setEditedName(event.target.value);
                                setEditError(null);
                              }}
                              aria-invalid={!!editError}
                              className={inputClassName}
                              autoFocus
                            />
                            {editError ? (
                              <p className="text-xs text-destructive">
                                {editError}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          category.name
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.createdAt
                          ? formatFileDate(category.createdAt)
                          : "—"}
                      </TableCell>
                      {showActions ? (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {isEditing ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={updateCategory.isPending}
                                  onClick={cancelEditing}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  loading={updateCategory.isPending}
                                  onClick={() => saveEditing(category.id)}
                                >
                                  Salvar
                                </Button>
                              </>
                            ) : (
                              <>
                                {canUpdate ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Editar ${category.name}`}
                                    onClick={() => startEditing(category)}
                                  >
                                    <Pencil aria-hidden />
                                  </Button>
                                ) : null}
                                {canDelete ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Excluir ${category.name}`}
                                    className="text-destructive hover:text-destructive"
                                    onClick={() =>
                                      setCategoryToDelete({
                                        id: category.id,
                                        name: category.name,
                                      })
                                    }
                                  >
                                    <Trash2 aria-hidden />
                                  </Button>
                                ) : null}
                              </>
                            )}
                          </div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteCategoryDialog
        categoryName={categoryToDelete?.name ?? null}
        open={categoryToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteCategory.isPending) {
            setCategoryToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isPending={deleteCategory.isPending}
      />
    </>
  );
}
