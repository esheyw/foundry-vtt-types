import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const token = new Token(new TokenDocument());
expectTypeOf(token.id).toEqualTypeOf<string>();
expectTypeOf(token.actor).toEqualTypeOf<Actor | null>();
expectTypeOf(token.document.actorId).toEqualTypeOf<string | null>();
expectTypeOf(token.document.actorLink).toEqualTypeOf<boolean>();
expectTypeOf(token.document.x).toEqualTypeOf<number>();
expectTypeOf(token.document.y).toEqualTypeOf<number>();
expectTypeOf(token.document.hidden).toEqualTypeOf<boolean>();
expectTypeOf(token.emitsLight).toEqualTypeOf<boolean>();
expectTypeOf(token.toggleVisibility()).toEqualTypeOf<Promise<TokenDocument.ConfiguredInstance[]>>();
expectTypeOf(token.toggleEffect(CONFIG.statusEffects[0])).toEqualTypeOf<Promise<boolean>>();
declare const effect: Document.Stored<ActiveEffect>;
expectTypeOf(token.toggleEffect(effect)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(token.toggleEffect("path/to/my/image.png")).toEqualTypeOf<Promise<boolean>>();
