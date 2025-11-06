import { Module } from '@nestjs/common';
import { PsyTestsController } from './presentation/psy-tests.controller';
import { PsyTestsOrchestrator } from './application/services/psy-tests-orchestrator/psy-tests-orchestrator.abstract';
import { PsyTestsOrchestratorImpl } from './application/services/psy-tests-orchestrator/psy-tests-orchestrator.impl';
import { GetPsyTestsHandler } from './application/queries/get-psy-tests/get-psy-tests.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { GetPsyTestByIdHandler } from './application/queries/get-psy-test-by-id/get-psy-test-by-id.handler';
import { TESTS_CLIENTS } from './domain/constants/tests-package.constant';
import { PsyTestsEngineGateway } from './domain/interfaces/psy-tests-engine.gateway';
import { GrpcTestsEngineGateway } from './infrastructure/grpc/grpc-tests-engine.gateway';
import { GetPsyTestByIdWithoutAnswersHandler } from './application/queries/get-psy-test-by-id-without-answers/get-psy-test-by-id-without-answers.handler';

@Module({
  imports: [CqrsModule, ClientsModule.registerAsync(TESTS_CLIENTS)],
  controllers: [PsyTestsController],
  providers: [
    {
      provide: PsyTestsEngineGateway,
      useClass: GrpcTestsEngineGateway,
    },
    {
      provide: PsyTestsOrchestrator,
      useClass: PsyTestsOrchestratorImpl,
    },
    GetPsyTestsHandler,
    GetPsyTestByIdHandler,
    GetPsyTestByIdWithoutAnswersHandler,
  ],
})
export class PsyTestsModule {}
