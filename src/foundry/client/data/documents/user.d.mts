import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial, InexactPartial } from "../../../../types/utils.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  type PingData = {
    /**
     * Pulls all connected clients' views to the pinged co-ordinates.
     */
    pull?: false;
    /**
     * The ping style, see CONFIG.Canvas.pings.
     */
    style: string;
    /**
     * The ID of the scene that was pinged.
     */
    scene: string;
    /**
     * The zoom level at which the ping was made.
     */
    zoom: number;
  };

  interface ActivityData {
    /** The ID of the scene that the user is viewing. */
    sceneId: string | null;

    /** The position of the user's cursor. */
    cursor: { x: number; y: number } | null;

    /** The IDs of the tokens the user has targeted in the currently viewed */
    targets: string[];

    /** Whether the user has an open WS connection to the server or not. */
    active: boolean;
  }

  /**
   * The client-side User document which extends the common BaseUser model.
   *
   * @see {@link Users}             The world-level collection of User documents
   * @see {@link UserConfig}     The User configuration application
   */
  class User extends ClientDocumentMixin(foundry.documents.BaseUser) {
    /**
     * Track whether the user is currently active in the game
     * @defaultValue `false`
     */
    active: boolean;

    /**
     * Track the ID of the Scene that is currently being viewed by the User
     * @defaultValue `null`
     */
    viewedScene: string | null;

    /**
     * A flag for whether the current User is a Trusted Player
     */
    get isTrusted(): boolean;

    /**
     * A flag for whether this User is the connected client
     */
    get isSelf(): boolean;

    override prepareDerivedData(): void;

    /**
     * Assign a specific boolean permission to this user.
     * Modifies the user permissions to grant or restrict access to a feature.
     *
     * @param permission - The permission name from USER_PERMISSIONS
     * @param allowed    - Whether to allow or restrict the permission
     */
    assignPermission(permission: keyof typeof CONST.USER_PERMISSIONS, allowed: boolean): Promise<this>;

    /**
     * Submit User activity data to the server for broadcast to other players.
     * This type of data is transient, persisting only for the duration of the session and not saved to any database.
     * Activity data uses a volatile event to prevent unnecessary buffering if the client temporarily loses connection.
     * @param activityData - An object of User activity data to submit to the server for broadcast.
     *                       (default: `{}`)
     */
    broadcastActivity(
      activityData?: InexactPartial<ActivityData>,
      options?: InexactPartial<{
        /**
         * If undefined, volatile is inferred from the activity data
         */
        volatile: boolean;
      }>,
    ): void;

    /**
     * Update the set of Token targets for the user given an array of provided Token ids.
     * @param targetIds - An array of Token ids which represents the new target set
     *                    (default: `[]`)
     */
    updateTokenTargets(targetIds?: string[]): void;

    override _onUpdate(
      data: DeepPartial<foundry.documents.BaseUser["_source"]>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    override _onDelete(options: DocumentModificationOptions, userId: string): void;
  }

  namespace User {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"User">>;
  }
}
