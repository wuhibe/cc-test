import { Controller, Get, HttpCode, Redirect } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @Redirect('/api', 301)
  root() {}

  @Get('health-check')
  @ApiOperation({
    summary: 'Health check endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is running',
    example: 'ok',
  })
  @HttpCode(200)
  health() {
    return 'ok';
  }
}
