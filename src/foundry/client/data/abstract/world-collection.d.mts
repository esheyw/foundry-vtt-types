import type {
  ConfiguredDocumentClass,
  ConstructorDataType,
  DocumentConstructor,
} from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";

declare global {
  /**
   * A collection of world-level Document objects with a singleton instance per primary Document type.
   * Each primary Document type has an associated subclass of WorldCollection which contains them.
   * @see {@link Game#collections}
   */
  abstract class WorldCollection<T extends DocumentConstructor> extends DirectoryCollectionMixin(DocumentCollection) {
    /**
     * Reference the set of Folders which contain documents in this collection
     */
    get folders(): Collection<Folder>;

    /**
     * Return a reference to the SidebarDirectory application for this WorldCollection.
     * @remarks
     * In the case where `Lowercase<Name>` is not a property of {@link ui}, this actually always returns `undefined`,
     * but {@link RollTables} overrides this, so we need to allow a wider return type.
     */
    // get directory(): Lowercase<Name> extends keyof typeof ui
    //   ? (typeof ui)[Lowercase<Name>]
    //   :
    //       | (ConfiguredDocumentClass<T>["metadata"]["name"] extends foundry.CONST.FOLDER_DOCUMENT_TYPES
    //           ? DocumentDirectory<ConfiguredDocumentClass<T>["metadata"]["name"]>
    //           : never)
    //       | SidebarTab
    //       | undefined
    //       | null;

    /**
     * Return a reference to the singleton instance of this WorldCollection, or null if it has not yet been created.
     */
    static get instance(): WorldCollection<DocumentConstructor>; // TODO: Find a way to type this more concretely. One option would be to separate the static and non static side of this class, which allows accessing the the static this type to use the `documentName`.

    protected override _getVisibleTreeContents(): InstanceType<ConfiguredDocumentClass<T>>[];

    /**
     * Apply data transformations when importing a Document from a Compendium pack
     * @param document - The source Document, or a plain data object
     * @param options  - Additional options which modify how the document is imported
     *                   (default: `{}`)
     * @returns The processed data ready for world Document creation
     * @remarks FromCompendiumOptions is inflated to account for expanded downstream use
     */
    fromCompendium<
      FolderOpt extends boolean = false,
      SortOpt extends boolean = true,
      OwnershipOpt extends boolean = false,
      IdOpt extends boolean = false,
    >(
      document: InstanceType<ConfiguredDocumentClass<T>> | ConstructorDataType<T>,
      options?: InexactPartial<WorldCollection.FromCompendiumOptions<FolderOpt, SortOpt, OwnershipOpt, IdOpt>>,
    ): Omit<
      InstanceType<ConfiguredDocumentClass<T>>["_source"],
      | ClientDocument.OmitProperty<FolderOpt, "folder">
      | ClientDocument.OmitProperty<SortOpt, "sort" | "navigation" | "navOrder">
      | ClientDocument.OmitProperty<OwnershipOpt, "ownership">
      | (IdOpt extends false ? "_id" : never)
    >;
  }

  namespace WorldCollection {
    interface FromCompendiumOptions<
      FolderOpt extends boolean = false,
      SortOpt extends boolean = true,
      OwnershipOpt extends boolean = false,
      IdOpt extends boolean = false,
      StateOpt extends boolean = false,
    > {
      /**
       * Add flags which track the import source
       * @defaultValue `false`
       */
      addFlags: boolean;

      /**
       * Clear the currently assigned folder
       * @defaultValue
       */
      clearFolder: FolderOpt;

      /**
       * Clear the currently assigned folder and sort order
       * @defaultValue `true`
       */
      clearSort: SortOpt;

      /**
       * Clear document permissions
       * @defaultValue `true`
       */
      clearOwnership: OwnershipOpt;

      /**
       * Retain the Document id from the source Compendium
       * @defaultValue `false`
       */
      keepId: IdOpt;

      /** @remarks used by Scene#fromCompendium */
      clearState: StateOpt;
    }
  }
}

type DropFirst<T extends Array<unknown>> = T extends [unknown, ...infer V] ? V : T;
