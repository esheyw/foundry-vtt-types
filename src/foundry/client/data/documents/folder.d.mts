import type { ConfiguredDocumentClassForName, DocumentType } from "../../../../types/helperTypes.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type BaseFolder from "../../../common/documents/folder.d.mts";
import type { BaseUser } from "../../../common/documents/module.d.mts";

declare global {
  /**
   * The client-side Folder document which extends the common BaseFolder model.
   *
   * @see {@link Folders}            The world-level collection of Folder documents
   * @see {@link FolderConfig}       The Folder configuration application
   */
  class Folder extends ClientDocumentMixin(foundry.documents.BaseFolder) {
    /**
     * The depth of this folder in its sidebar tree
     *
     * @remarks For folders that have been populated by the {@link SidebarDirectory}, this is always be defined
     */
    depth?: number;

    /**
     * An array of other Folders which are the displayed children of this one. This differs from the results of
     * {@link Folder.getSubfolders} because reports the subset of child folders which  are displayed to the current User
     * in the UI.
     */
    children: Folder.ConfiguredInstance[];

    /**
     * Return whether the folder is displayed in the sidebar to the current User.
     */
    displayed: boolean;

    /**
     * The array of the Document instances which are contained within this Folder,
     * unless it's a Folder inside a Compendium pack, in which case it's the array
     * of objects inside the index of the pack that are contained in this Folder.
     */
    get contents(): this["type"] extends DocumentType
      ? InstanceType<ConfiguredDocumentClassForName<this["type"]>>[]
      : never;

    set contents(value);

    /**
     * The reference to the Document type which is contained within this Folder.
     */
    get documentClass(): this["type"] extends DocumentType ? ConfiguredDocumentClassForName<this["type"]> : never;

    /**
     * Return a reference to the WorldCollection instance which provides Documents to this Folder,
     * unless it's a Folder inside a Compendium pack, in which case it's the index of the pack.
     */
    // TODO: Compendium Pack index
    get documentCollection(): this["pack"] extends string ? unknown : undefined;

    /**
     * Return whether the folder is currently expanded within the sidebar interface.
     */
    get expanded(): boolean;

    /**
     * Return the list of ancestors of this folder, starting with the parent.
     */
    get ancestors(): Folder.ConfiguredInstance[];

    protected _preCreate(
      data: BaseFolder.ConstructorData,
      options: DocumentModificationOptions,
      user: BaseUser,
    ): Promise<boolean | void>;

    /**
     * Get the Folder documents which are sub-folders of the current folder, either direct children or recursively.
     * @param recursive - Identify child folders recursively, if false only direct children are returned
     *                    (default: `false`)
     * @returns An array of Folder documents which are subfolders of this one
     */
    getSubfolders(recursive?: boolean): Folder.ConfiguredInstance[];

    /**
     * Get the Folder documents which are parent folders of the current folder or any if its parents.
     * @returns An array of Folder documents which are parent folders of this one
     */
    getParentFolders(): Folder.ConfiguredInstance[];
  }

  namespace Folder {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"Folder">>;

    interface ExportToCompendiumOptions {
      /** Update existing entries in the Compendium pack, matching by name */
      updateByName?: boolean | undefined;
    }
  }
}
