import { ConfigGetter } from '../../utils/config-getter.abstract';
import { PSY_TESTS_ENGINE_CONFIG_KEY } from './psy-tests-engine.config';
import { PsyTestsEngineConfig } from './psy-tests-engine-config.interface';

export class PsyTestsEngineConfigGetter extends ConfigGetter<PsyTestsEngineConfig> {
  protected readonly configKey = PSY_TESTS_ENGINE_CONFIG_KEY;
}
