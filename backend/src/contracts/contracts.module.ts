import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schemas/contracts.schema';
import { ProjectsModule } from 'src/projects/projects.module';
import { WpsModule } from 'src/wps/wps.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    ProjectsModule,
    WpsModule,
  ],
  controllers: [ContractsController],
  providers: [
    ContractsService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class ContractsModule {}
