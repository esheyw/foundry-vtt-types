import type { DeepPartial, InexactPartial } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseCards from "../../../common/documents/cards.d.mts";

declare global {
  namespace Cards {
    type ConfiguredClass = Document.ConfiguredClassForName<"Cards">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Cards">;

    type CardsAction = "deal" | "pass";

    interface BaseOperationOptions {
      /**
       * Create a ChatMessage which notifies that this action has occurred
       * @defaultValue `true`
       */
      chatNotification: boolean;
    }

    interface DealOptions extends BaseOperationOptions {
      /**
       * How to draw, a value from CONST.CARD_DRAW_MODES
       * @defaultValue `foundry.CONST.CARD_DRAW_MODES.FIRST`
       */
      how: foundry.CONST.CARD_DRAW_MODES;

      /**
       * Modifications to make to each Card as part of the deal operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Cards["_source"]>;

      /**
       * The name of the action being performed, used as part of the dispatched Hook event
       * @defaultValue `"deal"`
       */
      action: CardsAction;
    }

    /** Additional context which describes the operation */
    interface DealContext {
      /** The action name being performed, i.e. "deal", "pass" */
      action: CardsAction;

      /** An array of Card creation operations to be performed in each destination Cards document */
      toCreate: Card["_source"][][];

      /** Card update operations to be performed in the origin Cards document */
      fromUpdate: { _id: string; drawn: true }[];

      /** Card deletion operations to be performed in the origin Cards document */
      fromDelete: string[];
    }

    interface PassOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the pass operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Card["_source"]> | undefined;

      /**
       * The name of the action being performed, used as part of the dispatched Hook event
       * @defaultValue `"pass"`
       */
      action: string | undefined;
    }

    interface DrawOptions extends PassOptions {
      /**
       * How to draw, a value from CONST.CARD_DRAW_MODES
       * @defaultValue `foundry.CONST.CARD_DRAW_MODES.FIRST`
       */
      how: foundry.CONST.CARD_DRAW_MODES;

      /**
       * Modifications to make to each Card as part of the draw operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Card["_source"]>;
    }

    interface ShuffleOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the shuffle operation,
       * for example the displayed face
       * @defaultValue `{}`
       * @remarks This is not actually used by {@link Cards.shuffle}.
       */
      updateData: DeepPartial<Card["_source"]>;
    }

    /** Options which modify the reset operation */
    interface ResetOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the reset operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Card["_source"]>;
    }

    /** Additional context which describes the operation. */
    interface ReturnContext {
      /**
       * A mapping of Card deck IDs to the update operations that
       * will be performed on them.
       */
      toUpdate: Record<string, DeepPartial<Card["_source"]>[]>;

      /**
       * Card deletion operations to be performed on the origin Cards
       * document.
       */
      fromDelete: string[];
    }
  }

  /**
   * The client-side Cards document which extends the common BaseCards model.
   * Each Cards document contains CardsData which defines its data schema.
   *
   * @see {@link CardStacks}                        The world-level collection of Cards documents
   * @see {@link CardsConfig}                       The Cards configuration application
   */
  class Cards extends ClientDocumentMixin(foundry.documents.BaseCards) {
    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["img"];

    /**
     * The Card documents within this stack which are able to be drawn.
     */
    get availableCards(): Card.ConfiguredInstance[];

    /**
     * The Card documents which belong to this stack but have already been drawn.
     */
    get drawnCards(): Card.ConfiguredInstance[];

    /**
     * Returns the localized Label for the type of Card Stack this is
     */
    get typeLabel(): string;

    /**
     * Can this Cards document be cloned in a duplicate workflow?
     */
    get canClone(): boolean;

    // TODO: Figure out the typing here
    static override createDocuments(
      data: Array<Document.ConstructorDataFor<typeof Cards> & Record<string, unknown>>,
      context: Document.ModificationContext<Document.Any | null> & { temporary: false },
    ): Promise<Document.Stored<Cards.ConfiguredInstance>[]>;
    static createDocuments(
      data: Array<Document.ConstructorDataFor<typeof Cards> & Record<string, unknown>>,
      context: Document.ModificationContext<Document.Any | null> & { temporary: boolean },
    ): Promise<Cards.ConfiguredInstance[]>;
    static createDocuments(
      data: Array<Document.ConstructorDataFor<typeof Cards> & Record<string, unknown>>,
      context?: Document.ModificationContext<Document.Any | null>,
    ): Promise<Document.Stored<Cards.ConfiguredInstance>[]>;

    /**
     * Deal one or more cards from this Cards document to each of a provided array of Cards destinations.
     * Cards are allocated from the top of the deck in cyclical order until the required number of Cards have been dealt.
     * @param to      - An array of other Cards documents to which cards are dealt
     * @param number  - The number of cards to deal to each other document
     *                  (default: `1`)
     * @param options - (default: `{}`)
     * @returns This Cards document after the deal operation has completed
     */
    deal(
      to: Cards.ConfiguredInstance[],
      number?: number,
      options?: InexactPartial<Cards.DealOptions>,
    ): Promise<Cards.ConfiguredInstance>;

    /**
     * Pass an array of specific Card documents from this document to some other Cards stack.
     * @param to      - Some other Cards document that is the destination for the pass operation
     * @param ids     - The embedded Card ids which should be passed
     * @param options - Additional options which modify the pass operation
     *                  (default: `{}`)
     * @returns An array of the Card embedded documents created within the destination stack
     */
    pass(
      to: Cards.ConfiguredInstance,
      ids: string[],
      options?: InexactPartial<Cards.PassOptions>,
    ): Promise<Card.ConfiguredInstance[]>;

    /**
     * Draw one or more cards from some other Cards document.
     * @param from    - Some other Cards document from which to draw
     * @param number  - The number of cards to draw
     *                  (default: `1`)
     * @param options - (default: `{}`)
     * @returns An array of the Card documents which were drawn
     */
    draw(
      from: Cards.ConfiguredInstance,
      number?: number,
      options?: InexactPartial<Cards.DrawOptions>,
    ): Promise<Card.ConfiguredInstance[]>;

    /**
     * Shuffle this Cards stack, randomizing the sort order of all the cards it contains.
     * @param options - (default: `{}`)
     * @returns The Cards document after the shuffle operation has completed
     */
    shuffle(options?: InexactPartial<Cards.ShuffleOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * Reset the Cards stack, retrieving all original cards from other stacks where they may have been drawn if this is a
     * deck, otherwise returning all the cards in this stack to the decks where they originated.
     * @param options - Options which modify the reset operation
     *                  (default: `{}`)
     * @returns The Cards document after the reset operation has completed
     */
    reset(options?: InexactPartial<Cards.ResetOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * Perform a reset operation for a deck, retrieving all original cards from other stacks where they may have been
     * drawn.
     * @param options - Options which modify the reset operation.
     *                  (default: `{}`)
     * @returns The Cards document after the reset operation has completed.
     * @internal
     */
    protected _resetDeck(options?: InexactPartial<Cards.ResetOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * Return all cards in this stack to their original decks.
     * @param options - Options which modify the return operation.
     *                  (default: `{}`)
     * @returns The Cards document after the return operation has completed.
     * @internal
     */
    protected _resetStack(options?: InexactPartial<Cards.ResetOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * A sorting function that is used to determine the standard order of Card documents within an un-shuffled stack.
     * @param a - The card being sorted
     * @param b - Another card being sorted against
     */
    protected sortStandard(a: Card, b: Card): number;

    /**
     * A sorting function that is used to determine the order of Card documents within a shuffled stack.
     * @param a - The card being sorted
     * @param b - Another card being sorted against
     */
    protected sortShuffled(a: Card, b: Card): number;

    /**
     * An internal helper method for drawing a certain number of Card documents from this Cards stack.
     * @param number - The number of cards to draw
     * @param how    - A draw mode from CONST.CARD_DRAW_MODES
     * @returns An array of drawn Card documents
     */
    protected _drawCards(number: number, how: foundry.CONST.CARD_DRAW_MODES): Card.ConfiguredInstance[];

    /**
     * Create a ChatMessage which provides a notification of the cards operation which was just performed.
     * Visibility of the resulting message is linked to the default roll mode selected in the chat log dropdown.
     * @param source  - The source Cards document from which the action originated
     * @param action  - The localization key which formats the chat message notification
     * @param context - Data passed to the i18n.format method for the localization key
     * @returns A created ChatMessage document
     * @internal
     */
    protected _postChatNotification(
      source: Cards.ConfiguredInstance,
      action: string,
      context: Record<string, unknown>,
    ): Promise<ChatMessage.ConfiguredInstance | undefined>;

    protected override _onUpdate(
      data: fields.SchemaField.InnerAssignmentType<BaseCards.Schema>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _preDelete(
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser,
    ): Promise<void>;

    // TODO: It's a bit weird that we have to do it in this generic way but otherwise there is an error overriding this. Investigate later.
    static override deleteDocuments<T extends Document.AnyConstructor>(
      this: T,
      ids?: string[],
      context?: Document.ModificationContext<Document.Any | null>,
    ): Promise<Document.ToConfiguredInstance<T>[]>;

    /**
     * Display a dialog which prompts the user to deal cards to some number of hand-type Cards documents.
     * @see {@link Cards#deal}
     */
    dealDialog(): Promise<Cards.ConfiguredInstance | null>;

    /**
     * Display a dialog which prompts the user to draw cards from some other deck-type Cards documents.
     * @see {@link Cards#draw}
     */
    drawDialog(): Promise<Card.ConfiguredInstance[] | null>;

    /**
     * Display a dialog which prompts the user to pass cards from this document to some other other Cards document.
     * @see {@link Cards#deal}
     */
    passDialog(): Promise<Cards.ConfiguredInstance | null>;

    /**
     * Display a dialog which prompts the user to play a specific Card to some other Cards document
     * @see {@link Cards#pass}
     * @param card - The specific card being played as part of this dialog
     */
    playDialog(card: Card.ConfiguredInstance): Promise<Card.ConfiguredInstance[] | void | null>;

    /**
     * Display a confirmation dialog for whether or not the user wishes to reset a Cards stack
     * @see {@link Cards#reset}
     */
    resetDialog(): Promise<Cards.ConfiguredInstance | false | null>;

    override deleteDialog(options?: Partial<DialogOptions>): Promise<this | false | null | undefined>;

    // TODO: It's a bit weird that we have to do it in this generic way but otherwise there is an error overriding this. Investigate later.
    static override createDialog<T extends Document.AnyConstructor>(
      this: T,
      data?: DeepPartial<Cards["_source"] | (Cards["_source"] & Record<string, unknown>)>,
      context?: Pick<Document.ModificationContext<Document.Any | null>, "parent" | "pack"> & Partial<DialogOptions>,
    ): Promise<Document.ToConfiguredInstance<T> | null | undefined>;
  }
}
