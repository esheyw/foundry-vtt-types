import type { DocumentConstructor } from "../../types/helperTypes.d.mts";
import type { ConstructorOf } from "../../types/utils.d.mts";
import type * as CONST from "../common/constants.d.mts";
import type { DataModel } from "../common/abstract/module.d.mts";

declare global {
  /**
   * Runtime configuration settings for Foundry VTT which exposes a large number of variables which determine how
   * aspects of the software behaves.
   *
   * Unlike the CONST analog which is frozen and immutable, the CONFIG object may be updated during the course of a
   * session or modified by system and module developers to adjust how the application behaves.
   */
  interface CONFIG {
    /**
     * Configure debugging flags to display additional information
     */
    debug: {
      /** @defaultValue `false` */
      dice: boolean;

      /** @defaultValue `false` */
      documents: boolean;

      fog: {
        /** @defaultValue `false` */
        extractor: boolean;

        /** @defaultValue `false` */
        manager: boolean;
      };

      /** @defaultValue `false` */
      hooks: boolean;

      /** @defaultValue `false` */
      av: boolean;

      /** @defaultValue `false` */
      avclient: boolean;

      /** @defaultValue `false` */
      mouseInteraction: boolean;

      /** @defaultValue `false` */
      time: boolean;

      /** @defaultValue `false` */
      keybindings: boolean;

      /** @defaultValue `false` */
      polygons: boolean;

      /** @defaultValue `false` */
      gamepad: boolean;
    };

    /**
     * Configure the verbosity of compatibility warnings generated throughout the software.
     * The compatibility mode defines the logging level of any displayed warnings.
     * The includePatterns and excludePatterns arrays provide a set of regular expressions which can either only
     * include or specifically exclude certain file paths or warning messages.
     * Exclusion rules take precedence over inclusion rules.
     *
     * @see {@link CONST.COMPATIBILITY_MODES}
     *
     * @example Include Specific Errors
     * ```js
     * const includeRgx = new RegExp("/systems/dnd5e/module/documents/active-effect.mjs");
     * CONFIG.compatibility.includePatterns.push(includeRgx);
     * ```
     *
     * @example Exclude Specific Errors
     * ```js
     * const excludeRgx = new RegExp("/systems/dnd5e/");
     * CONFIG.compatibility.excludePatterns.push(excludeRgx);
     * ```
     *
     * @example Both Include and Exclude
     * ```js
     * const includeRgx = new RegExp("/systems/dnd5e/module/actor/");
     * const excludeRgx = new RegExp("/systems/dnd5e/module/actor/sheets/base.js");
     * CONFIG.compatibility.includePatterns.push(includeRgx);
     * CONFIG.compatibility.excludePatterns.push(excludeRgx);
     * ```
     *
     * @example Targeting more than filenames
     * ```js
     * const includeRgx = new RegExp("applyActiveEffects");
     * CONFIG.compatibility.includePatterns.push(includeRgx);
     * ```
     */
    compatibility: {
      mode: CONST.COMPATIBILITY_MODES;
      includePatterns: RegExp[];
      excludePatterns: RegExp[];
    };

    /**
     * Configure the DatabaseBackend used to perform Document operations
     * @defaultValue `new ClientDatabaseBackend()`
     */
    DatabaseBackend: ClientDatabaseBackend;

    /**
     * Configuration for the Cards primary Document type
     */
    Cards: {
      /** @defaultValue `CardStacks` */
      collection: ConstructorOf<CardStacks>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `Cards` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Cards>;

      /** @defaultValue `"fa-solid fa-cards"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, ConstructorOf<DataModel<any, Cards>>>;

      /**
       * @defaultValue
       * ```typescript
       * {
       *    pokerDark: {
       *      type: "deck",
       *      label: "CARDS.DeckPresetPokerDark",
       *      src: "cards/poker-deck-dark.json"
       *    },
       *    pokerLight: {
       *      type: "deck",
       *      label: "CARDS.DeckPresetPokerLight",
       *      src: "cards/poker-deck-light.json"
       *    }
       * }
       * ```
       */
      presets: Record<string, CONFIG.Cards.Preset>;

      /** @defaultValue `{}` */
      typeLabels: Record<string, string>;

      typeIcons: {
        /** @defaultValue `"fas fa-cards"` */
        deck: string;
        /** @defaultValue `"fa-duotone fa-cards"` */
        hand: string;
        /** @defaultValue `"fa-duotone fa-layer-group"` */
        pile: string;
        [x: string]: string;
      };
    };

    /**
     * Configuration for the Folder entity
     */
    Folder: {
      /** @defaultValue `Folder` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Folder>;

      /** @defaultValue `Folders` */
      collection: ConstructorOf<Folders>;

      /** @defaultValue `"fas fa-folder"` */
      sidebarIcon: string;
    };

    /**
     * Configuration for the User entity, it's roles, and permissions
     */
    User: {
      /** @defaultValue `User` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof User>;

      /** @defaultValue `Users` */
      collection: ConstructorOf<Users>;
    };

    /**
     * Configuration for the Card embedded Document type
     */
    Card: {
      /** @defaultValue `Card` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Card>;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, ConstructorOf<DataModel<any, Card>>>;
    };
  }

  namespace CONFIG {
    namespace Cards {
      interface Preset {
        type: string;
        label: string;
        src: string;
      }
    }
    namespace Combat {
      interface SoundPreset {
        label: string;
        startEncounter: string[];
        nextUp: string[];
        yourTurn: string[];
      }
    }

    namespace Font {
      interface Definition extends FontFaceDescriptors {
        url: string[];
      }
      interface FamilyDefinition {
        editor: boolean;
        fonts: Definition[];
      }
    }

    interface WallDoorSound {
      /** A localization string label */
      label: string;

      /** A sound path when the door is closed */
      close: string;

      /** A sound path when the door becomes locked */
      lock: string;

      /** A sound path when opening the door */
      open: string;

      /** A sound path when attempting to open a locked door */
      test: string;

      /** A sound path when the door becomes unlocked */
      unlock: string;
    }
    namespace Dice {
      interface RollModes extends Record<foundry.CONST.DICE_ROLL_MODES, string> {}
    }
  }

  const CONFIG: CONFIG;
}

type ConfiguredDocumentClassOrDefault<Fallback extends DocumentConstructor> =
  Fallback["metadata"]["name"] extends keyof DocumentClassConfig
    ? DocumentClassConfig[Fallback["metadata"]["name"]]
    : Fallback;
