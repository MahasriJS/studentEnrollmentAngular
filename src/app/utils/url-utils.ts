export class UrlUtils {

    baseUrl: string = 'http://localhost:8080/';
    contextPath: string = 'student-enrollment';
    getBaseUrl(): string {
        return this.baseUrl + this.contextPath;
    }
}
