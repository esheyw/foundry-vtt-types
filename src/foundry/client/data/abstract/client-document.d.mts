import type { ConfiguredDocumentClass, DocumentConstructor } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial, InexactPartial, Mixin, ValueOf } from "../../../../types/utils.d.mts";
import type { AnyMetadata, DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare class ClientDocument<
  BaseDocument extends foundry.abstract.Document<any, ConcreteMetadata, any> = foundry.abstract.Document<
    any,
    AnyMetadata,
    any
  >,
  ConcreteMetadata extends AnyMetadata = AnyMetadata,
> {
  constructor(data?: BaseDocument["_source"], context?: DocumentConstructionContext);

  static name: "ClientDocumentMixin";

  /**
   * @see abstract.Document#_initialize
   */
  protected _initialize(): void;

  /**
   * Return a reference to the parent Collection instance which contains this Document.
   */
  get collection(): Collection<this>;

  /**
   * A boolean indicator for whether or not the current game User has ownership rights for this Document.
   * Different Document types may have more specialized rules for what constitutes ownership.
   */
  get isOwner(): boolean;

  /**
   * Test whether this Document is owned by any non-Gamemaster User.
   */
  get hasPlayerOwner(): boolean;

  /**
   * A boolean indicator for whether the current game User has exactly LIMITED visibility (and no greater).
   */
  get limited(): boolean;

  /**
   * Return a string which creates a dynamic link to this Document instance.
   */
  get link(): string;

  /**
   * Return the permission level that the current game User has over this Document.
   * See the CONST.DOCUMENT_OWNERSHIP_LEVELS object for an enumeration of these levels.
   *
   * @example
   * ```typescript
   * game.user.id; // "dkasjkkj23kjf"
   * actor.data.permission; // {default: 1, "dkasjkkj23kjf": 2};
   * actor.permission; // 2
   * ```
   */
  get permission(): ValueOf<typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>;

  /**
   * A Universally Unique Identifier (uuid) for this Document instance.
   */
  get uuid(): string;

  /**
   * A boolean indicator for whether or not the current game User has at least limited visibility for this Document.
   * Different Document types may have more specialized rules for what determines visibility.
   */
  get visible(): boolean;

  /**
   * Safely prepare data for a Document, catching any errors.
   */
  protected _safePrepareData(): void;

  /**
   * Prepare data for the Document. This method is called automatically by the DataModel#_initialize workflow.
   * This method provides an opportunity for Document classes to define special data preparation logic.
   * The work done by this method should be idempotent. There are situations in which prepareData may be called more
   * than once.
   */
  prepareData(): void;

  /**
   * Prepare data related to this Document itself, before any embedded Documents or derived data is computed.
   */
  prepareBaseData(): void;

  /**
   * Prepare all embedded Document instances which exist within this primary Document.
   */
  prepareEmbeddedDocuments(): void;

  /**
   * Apply transformations or derivations to the values of the source data object.
   * Compute data fields whose values are not stored to the database.
   */
  prepareDerivedData(): void;

  /**
   * Construct a UUID relative to another document.
   * @param doc - The document to compare against.
   */
  getRelativeUuid(doc: ClientDocument): string;

  /**
   * Createa  content link for this document
   * @param eventData - The parsed object of data provided by the drop transfer event.
   * @param options   - Additional options to configure link generation.
   */
  protected _createDocumentLink(
    eventData: unknown,
    options?: InexactPartial<{
      /**
       * A document to generate a link relative to.
       */
      relativeTo: ClientDocument;

      /**
       * A custom label to use instead of the document's name.
       */
      label: string;
    }>,
  ): string;

  /**
   * Handle clicking on a content link for this document.
   * @param event - The triggering click event.
   */
  _onClickDocumentLink(event: MouseEvent): unknown;

  /**
   * @see abstract.Document#_onCreate
   */
  protected _onCreate(data: BaseDocument["_source"], options: DocumentModificationOptions, userId: string): void;

  /**
   * @see abstract.Document#_onUpdate
   */
  protected _onUpdate(
    data: DeepPartial<BaseDocument["_source"]>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * @see abstract.Document#_onDelete
   */
  protected _onDelete(options: DocumentModificationOptions, userId: string): void;

  /**
   * Orchestrate dispatching descendant document events to parent documents when embedded children are modified.
   * @param event      - The event name, preCreate, onCreate, etc...
   * @param collection - The collection name being modified within this parent document
   * @param args       - Arguments passed to each dispatched function
   * @param _parent    - The document with directly modified embedded documents.
   *                     Either this document or a descendant of this one.
   * @internal
   */
  protected _dispatchDescendantDocumentEvents(
    event: ClientDocument.lifeCycleEventName,
    collection: string,
    args: unknown[],
    _parent: ClientDocument,
  ): void;

  // TODO: Improve the data typing
  /**
   * Actions taken after descendant documents have been created, but before changes are applied to the client data.
   * @param parent     - The direct parent of the created Documents, may be this Document or a child
   * @param collection - The collection within which documents are being created
   * @param data       - The source data for new documents that are being created
   * @param options    - Options which modified the creation operation
   * @param userId     - The ID of the User who triggered the operation
   */
  protected _preCreateDescendantDocuments(
    parent: ClientDocument,
    collection: string,
    data: unknown[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been created and changes have been applied to client data.
   * @param parent     - The direct parent of the created Documents, may be this Document or a child
   * @param collection - The collection within which documents were created
   * @param documents  - The array of created Documents
   * @param data       - The source data for new documents that were created
   * @param options    - Options which modified the creation operation
   * @param userId     - The ID of the User who triggered the operation
   */
  protected _onCreateDescendantDocuments(
    parent: ClientDocument,
    collection: string,
    documents: ClientDocument[],
    data: unknown[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;
  /**
   * Actions taken after descendant documents have been updated, but before changes are applied to the client data.
   * @param parent - The direct parent of the updated Documents, may be this Document or a child
   * @param collection - The collection within which documents are being updated
   * @param changes - The array of differential Document updates to be applied
   * @param options - Options which modified the update operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _preUpdateDescendantDocuments(
    parent: ClientDocument,
    collection: string,
    changes: unknown[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been updated and changes have been applied to client data.
   * @param parent - The direct parent of the updated Documents, may be this Document or a child
   * @param collection - The collection within which documents were updated
   * @param documents - The array of updated Documents
   * @param changes - The array of differential Document updates which were applied
   * @param options - Options which modified the update operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _onUpdateDescendantDocuments(
    parent: ClientDocument,
    collection: string,
    documents: ClientDocument[],
    changes: unknown[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been deleted, but before deletions are applied to the client data.
   * @param parent - The direct parent of the deleted Documents, may be this Document or a child
   * @param collection - The collection within which documents were deleted
   * @param ids - The array of document IDs which were deleted
   * @param options - Options which modified the deletion operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _preDeleteDescendantDocuments(
    parent: ClientDocument,
    collection: string,
    ids: string[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been deleted and those deletions have been applied to client data.
   * @param parent - The direct parent of the deleted Documents, may be this Document or a child
   * @param collection - The collection within which documents were deleted
   * @param documents - The array of Documents which were deleted
   * @param ids - The array of document IDs which were deleted
   * @param options - Options which modified the deletion operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _onDeleteDescendantDocuments(
    parent: ClientDocument,
    collection: string,
    documents: ClientDocument[],
    ids: string,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Whenever the Document's sheet changes, close any existing applications for this Document, and re-render the new
   * sheet if one was already open.
   */
  protected _onSheetChange(
    options?: InexactPartial<{
      /**
       * Whether the sheet was originally open and needs to be re-opened.
       */
      sheetOpen: boolean;
    }>,
  ): Promise<void>;

  /**
   * Gets the default new name for a Document
   */
  static defaultName(): string;

  /**
   * Export document data to a JSON file which can be saved by the client and later imported into a different session.
   * @param options - Additional options passed to the {@link ClientDocument#toCompendium} method
   */
  exportToJSON(options?: InexactPartial<ClientDocument.CompendiumExportOptions>): void;

  /**
   * Create a content link for this Document.
   * @param options - Additional options to configure how the link is constructed.
   */
  toAnchor(
    options?: InexactPartial<{
      /**
       * Attributes to set on the link.
       * @defaultValue `{}`
       */
      attrs: Record<string, string>;

      /**
       * Custom data- attributes to set on the link.
       * @defaultValue `{}`
       */
      dataset: Record<string, string>;

      /**
       * Additional classes to add to the link.
       * The `content-link` class is added by default.
       * @defaultValue `[]`
       */
      classes: string[];

      /**
       * A name to use for the Document, if different from the Document's name.
       */
      name: string;

      /**
       * A font-awesome icon class to use as the icon, if different to the Document's configured sidebarIcon.
       */
      icon: string;
    }>,
  ): HTMLAnchorElement;

  /**
   * Serialize salient information about this Document when dragging it.
   */
  toDragData(): DropData<BaseDocument>;

  /**
   * A helper function to handle obtaining the relevant Document from dropped data provided via a DataTransfer event.
   * The dropped data could have:
   * 1. A data object explicitly provided
   * 2. A UUID
   *
   * @param data    - The data object extracted from a DataTransfer event
   * @param options - Additional options which affect drop data behavior
   * @returns The resolved Document
   * @throws If a Document could not be retrieved from the provided data.
   */
  static fromDropData<T extends DocumentConstructor>(
    this: T,
    data: DropData<InstanceType<T>>,
    options?: FromDropDataOptions,
  ): Promise<InstanceType<ConfiguredDocumentClass<T>> | undefined>;

  /**
   * Update this Document using a provided JSON string.
   * @param json - JSON data string
   * @returns The updated Document instance
   */
  importFromJSON(json: string): Promise<this>;

  /**
   * Render an import dialog for updating the data related to this Document through an exported JSON file
   */
  importFromJSONDialog(): Promise<void>;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are created.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of created data objects
   * @param options      - Options which modified the creation operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _preCreateEmbeddedDocuments(
    embeddedName: string,
    result: Record<string, unknown>[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are created.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of created Documents
   * @param result       - An Array of created data objects
   * @param options      - Options which modified the creation operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _onCreateEmbeddedDocuments(
    embeddedName: string,
    documents: foundry.abstract.Document<any, any, any>[],
    result: Record<string, unknown>[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are updated.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of incremental data objects
   * @param options      - Options which modified the update operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _preUpdateEmbeddedDocuments(
    embeddedName: string,
    result: Record<string, unknown>[],
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are updated.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of updated Documents
   * @param result       - An Array of incremental data objects
   * @param options      - Options which modified the update operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _onUpdateEmbeddedDocuments(
    embeddedName: string,
    documents: foundry.abstract.Document<any, any, any>[],
    result: Record<string, unknown>[],
    options: DocumentModificationContext,
    userId: string,
  ): void;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are deleted.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of document IDs being deleted
   * @param options      - Options which modified the deletion operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _preDeleteEmbeddedDocuments(
    embeddedName: string,
    result: string[],
    options: DocumentModificationContext,
    userId: string,
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are deleted.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of deleted Documents
   * @param result       - An Array of document IDs being deleted
   * @param options      - Options which modified the deletion operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _onDeleteEmbeddedDocuments(
    embeddedName: string,
    documents: foundry.abstract.Document<any, any, any>[],
    result: string[],
    options: DocumentModificationContext,
    userId: string,
  ): void;
}

declare global {
  type ClientDocument = ReturnType<typeof ClientDocumentMixin>;

  /**
   * A mixin which extends each Document definition with specialized client-side behaviors.
   * This mixin defines the client-side interface for database operations and common document behaviors.
   */
  function ClientDocumentMixin<BaseClass extends DocumentConstructor>(
    Base: BaseClass,
  ): Mixin<typeof ClientDocument, BaseClass>;

  namespace ClientDocument {
    // TODO: This may be better defined elsewhere
    type lifeCycleEventName = "preCreate" | "onCreate" | "preUpdate" | "onUpdate" | "preDelete" | "onDelete";

    type OmitProperty<T extends boolean, Property extends string> = T extends true ? Property : never;

    interface CompendiumExportOptions<
      FlagsOpt extends boolean = false,
      SourceOpt extends boolean = true,
      SortOpt extends boolean = true,
      FolderOpt extends boolean = false,
      OwnershipOpt extends boolean = false,
      StateOpt extends boolean = true,
      IdOpt extends boolean = false,
    > {
      /**
       * Clear the flags object
       * @defaultValue `false`
       */
      clearFlags: FlagsOpt;

      /**
       * Clear any prior sourceId flag
       * @defaultValue `true`
       */
      clearSource: SourceOpt;

      /**
       * Clear the currently assigned folder and sort order
       * @defaultValue `true`
       */
      clearSort: SortOpt;

      /**
       * Clear the currently assigned folder
       * @defaultValue `false`
       */
      clearFolder: FolderOpt;

      /**
       * Clear document ownership
       * @defaultValue `true`
       */
      clearOwnership: OwnershipOpt;

      /**
       * Clear fields which store document state
       * @defaultValue `true`
       */
      clearState: StateOpt;

      /**
       * Retain the current Document id
       * @defaultValue `false`
       */
      keepId: IdOpt;
    }
  }
}

export type DropData<T extends foundry.abstract.Document<any, any, any>> = T extends { id: string | undefined }
  ? DropData.Data<T> & DropData.UUID
  : DropData.Data<T>;

declare namespace DropData {
  interface Data<T extends foundry.abstract.Document<any, any, any>> {
    type: T["documentName"];
    data: T["_source"];
  }

  interface UUID {
    uuid: string;
  }
}

interface FromDropDataOptions {
  /**
   * Import the provided document data into the World, if it is not already a World-level Document reference
   * @defaultValue `false`
   */
  importWorld?: boolean;
}
