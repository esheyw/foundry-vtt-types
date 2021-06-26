import { expectType } from 'tsd';

expectType<ForegroundLayer>(ForegroundLayer.instance);
expectType<MapLayer.LayerOptions<'foreground'>>(ForegroundLayer.layerOptions);

const layer = new ForegroundLayer();
expectType<'foreground'>(layer.options.name);
expectType<Tile[]>(layer.roofs);
expectType<boolean>(layer.displayRoofs);
expectType<Promise<undefined>>(layer.draw());
expectType<ForegroundLayer>(layer.deactivate());
expectType<Promise<ForegroundLayer>>(layer.tearDown());
expectType<number>(layer.getZIndex());
expectType<Iterable<foundry.documents.BaseTile>>(layer.getDocuments()); // ToDo: Replace with TileDocument once it is available
expectType<void>(layer.refresh());
expectType<void>(layer.updateOcclusion());
