import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { recursivelyStripNullValues } from "../../utils/utils";

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(value => {
            const returnVal = recursivelyStripNullValues(value);
            console.log("----NULL Excluded object------", returnVal)
            return returnVal;
        }));
    }
}